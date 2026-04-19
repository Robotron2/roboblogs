# RoboBlogs Advanced SEO & AI Readability Flow

This document outlines the Search Engine Optimization (SEO) and Machine Readability architecture implemented in the RoboBlogs web application. Because the application is a Client-Side Rendered (CSR) Single Page Application built with Vite and React, standard crawlers and AI bots natively struggle to parse the content.

We solved this using a hybrid approach that caters to both real users and robotic parsers.

---

## 1. The Vercel Interceptor (for AI and Non-JS Crawlers)

When an AI crawler (like ChatGPT, ClaudeBot, or older search engine bots) requests a specific article by URL, they do not execute JavaScript. Therefore, they only see an empty `<div id="root"></div>` over the wire.

To solve this, we implemented a Vercel Serverless Edge Function that acts as a proxy for article routes.

### How It Works:
1. **Routing Interception (`vercel.json`)**: Request traffic matching `/article/:slug` is piped directly to the `/api/seo` serverless function rather than immediately returning the generic Vite `index.html`.
2. **Data Fetching**: The `seo.js` function extracts the `:slug` from the URL, queries the live Express API (`/api/v1/posts/:slug`), and retrieves the target article.
3. **HTML Mutation**:
   - The function reads the compiled `dist/index.html` file into memory.
   - It statically injects standard `<title>` and `<meta name="description">` tags.
   - It attaches `<meta property="og:*">` and `<meta name="twitter:*">` tags for rich social media cards.
   - It appends a **JSON-LD Schema** (`<script type="application/ld+json">`) representing a `BlogPosting` object.
   - Most importantly: it generates strict Semantic HTML (`<article>`, `<header>`, `<section>`) containing the entire blog post body and injects it into `<div id="seo-prerender">` inside the `#root` div.
4. **Delivery**: The function outputs this fully hydrated HTML string. Bots immediately read the semantic payload. Real users receive the payload, but React effortlessly hydrates the DOM over it immediately without a flash of default content.

**Location:** `client/api/seo.js` & `client/vercel.json`

---

## 2. Client-Side SEO Management (`react-helmet-async`)

When a user initially loads the site on `/` or `/blogs`, the standard React CSR flow spins up. If the user clicks a link to an article, the SPA routing (`react-router-dom`) takes over, meaning the Vercel Interceptor is bypassed entirely.

To maintain dynamic tab titles and metadata for client-side navigations:

1. **HelmetProvider**: The entire React tree is wrapped in `HelmetProvider` inside `src/main.tsx`.
2. **SEO Component**: A reusable `<SEO>` component (`src/components/SEO.tsx`) handles injecting or updating `<head>` nodes.
3. **Page Injection**: 
   - `SinglePost.tsx` passes its fetched article context to the `<SEO>` component dynamically.
   - `Home.tsx` and `Blogs.tsx` pass static, optimized meta descriptions declaring the purpose of the platform.

**Location:** `client/src/components/SEO.tsx` & Page Components

---

## 3. RSS XML Endpoints

For aggregators, feed readers (like Feedly), and some automated content ingestors, we built a dedicated RSS feed endpoint directly into the Express backend.

### How It Works:
- **XML Construction**: Using the `/api/v1/posts/feed/rss` route, the backend fetches the `20` most recent published articles.
- **Payload Safety**: Titles and content blobs are passed through `CDATA` blockers or safely encoded to ensure they do not break XML parsing schemas.
- **Consumption**: Bots pointing to this URL get an immediate, JS-free, pure-data stream of platform content updates.

**Location:** `server/src/controllers/post.controller.ts` & `server/src/routes/post.routes.ts`

---

## 4. Robots Directives

We implemented a permissive `robots.txt` mapping at the root of the client bucket that allows free parsing across all user-agents. This overtly signals to AI indexes (like Google-Extended, GPTBot, and Anthropic-ai) that they are welcomed.

**Location:** `client/public/robots.txt`
