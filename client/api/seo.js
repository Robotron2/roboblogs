const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { slug } = req.query;
  const baseUrl = process.env.VITE_API_URL || 'https://roboblogs.the0philus.xyz/api/v1';
  
  try {
    // 1. Fetch the data from the backend
    const response = await fetch(`${baseUrl}/posts/${slug}`);
    
    if (!response.ok) {
        // Fallback to basic html
        return sendDefaultHtml(res);
    }
    
    const { data } = await response.json();
    const post = data;

    if (!post) {
      return sendDefaultHtml(res);
    }

    // 2. Read the static index.html built by Vite
    let indexHtml = '';
    try {
      indexHtml = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
    } catch (e) {
      // In local dev `dist` might not exist yet, fallback if needed
      return res.status(500).send('dist/index.html not found. Please build the client.');
    }

    // 3. Prepare meta tags and JSON-LD
    const siteName = 'RoboBlogs';
    const postUrl = `https://roboblogs.the0philus.xyz/article/${post.slug}`;
    const authorName = (post.author && post.author.name) ? post.author.name : 'Unknown';
    // Clean description: strip HTML tags and truncate
    const plainDescription = post.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...';

    const metaTags = `
      <title>${post.title} | ${siteName}</title>
      <meta name="description" content="${plainDescription}" />
      <meta property="og:title" content="${post.title}" />
      <meta property="og:description" content="${plainDescription}" />
      <meta property="og:image" content="${post.coverImage || ''}" />
      <meta property="og:url" content="${postUrl}" />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content="${post.createdAt}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${post.title}" />
      <meta name="twitter:description" content="${plainDescription}" />
      <meta name="twitter:image" content="${post.coverImage || ''}" />
    `;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.coverImage ? [post.coverImage] : [],
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt,
      "author": [{
        "@type": "Person",
        "name": authorName
      }],
      "description": plainDescription
    };

    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

    // 4. Prepare semantic HTML for non-JS crawlers
    // Hide it by default for real users so React can hydrate cleanly over it without flicker
    const prerenderedContent = `
      <div id="seo-prerender" style="display:none;">
        <article>
          <header>
            <h1>${post.title}</h1>
            <p>By ${authorName} on ${new Date(post.createdAt).toDateString()}</p>
          </header>
          <section>
            ${post.content}
          </section>
        </article>
      </div>
    `;

    // 5. Inject into the HTML string
    // Replace <title> tag if it exists, otherwise just insert into <head>
    indexHtml = indexHtml.replace(/<title>.*?<\/title>/i, '');
    indexHtml = indexHtml.replace('</head>', `${metaTags}\n${jsonLdScript}\n</head>`);
    
    // Inject the prerendered HTML right after the <body> tag or inside <div id="root">
    indexHtml = indexHtml.replace('<div id="root"></div>', `<div id="root">${prerenderedContent}</div>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
    return res.status(200).send(indexHtml);

  } catch (error) {
    console.error('SEO Edge Function Error:', error);
    sendDefaultHtml(res);
  }
};

function sendDefaultHtml(res) {
  try {
    const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(indexHtml);
  } catch (e) {
    return res.status(500).send('dist/index.html not found.');
  }
}
