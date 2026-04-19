import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  author?: string;
}

export default function SEO({ 
  title, 
  description, 
  name, 
  type, 
  image, 
  url,
  author 
}: SEOProps) {
  const defaultTitle = "RoboBlogs - The Hub for Robotics and Tech";
  const defaultDescription = "Exploring the forefront of robotics, artificial intelligence, and technology innovations at RoboBlogs.";
  const defaultName = "RoboBlogs";

  const seo = {
    title: title ? `${title} | ${defaultName}` : defaultTitle,
    description: description || defaultDescription,
    image: image || "https://roboblogs.the0philus.xyz/og-image.jpg",
    url: url || (typeof window !== 'undefined' ? window.location.href : "https://roboblogs.the0philus.xyz"),
    type: type || "website",
    name: name || defaultName,
    author: author || "RoboBlogs Team"
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seo.title}</title>
      <meta name='description' content={seo.description} />
      {/* Open Graph tags */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content={seo.name} />
      {/* Twitter tags */}
      <meta name="twitter:creator" content={seo.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={seo.image} /> }
      <link rel="canonical" href={seo.url} />
      {author && <meta name="author" content={author} />}
    </Helmet>
  );
}
