import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'المصري إلكترونيكس';
const SITE_URL = 'https://elmasry-electronics.com';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;

/**
 * Reusable SEO head component.
 * @param {string}  title       – Page title (will be appended with site name if not homepage)
 * @param {string}  description – Meta description (max ~160 chars)
 * @param {string}  [keywords]  – Comma-separated keywords
 * @param {string}  [url]       – Canonical URL (defaults to SITE_URL)
 * @param {string}  [image]     – OG image URL (defaults to favicon)
 * @param {boolean} [noindex]   – Exclude the page from search engines (noindex, follow)
 * @param {object}  [jsonLd]    – Structured data object rendered as application/ld+json
 */
const SEO = ({ title, description, keywords, url, image, noindex, jsonLd }) => {
  const canonical = url || SITE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ar_EG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
