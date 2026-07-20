import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// ─── Site-wide constants ───────────────────────────────────────────────────────
export const SITE = {
  name:        'Janki Ballabh Services',
  domain:      'https://jankiballabhservices.in',
  tagline:     'Industrial Infrastructure & Renewable Energy Solutions',
  phone:       '+919079139959',
  email:       'Jankiballabh2510@gmail.com',
  address: {
    streetAddress:   'Plot No. D-32A, Narottampura, Vastu Nagar Phase-3, Bad Ke Balaji, Jaisinghpura',
    addressLocality: 'Jaipur',
    addressRegion:   'Rajasthan',
    postalCode:      '302026',
    addressCountry:  'IN',
  },
  ogImage: 'https://jankiballabhservices.in/og-image.jpg',
  logo:    'https://jankiballabhservices.in/favicon.ico',
  gst:     '08GBBPS0582P1ZY',
};

// ─── Default structured data (Organization + LocalBusiness + WebSite) ─────────
export const buildBaseSchema = () => [
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Organization'],
    '@id': `${SITE.domain}/#organization`,
    name: SITE.name,
    alternateName: 'JBS',
    url: SITE.domain,
    logo: {
      '@type': 'ImageObject',
      url: SITE.logo,
      width: 512,
      height: 512,
    },
    image: SITE.ogImage,
    description:
      'Janki Ballabh Services is a premier industrial infrastructure company in Jaipur, Rajasthan, specialising in solar EPC, water pipeline laying, civil construction, fiber maintenance, and AC/DC electrical work.',
    telephone: SITE.phone,
    email: SITE.email,
    taxID: SITE.gst,
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '26.8318',
      longitude: '75.7479',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phone,
        contactType: 'customer service',
        areaServed: ['IN'],
        availableLanguage: ['Hindi', 'English'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/jankiballabh',
    ],
    hasMap: 'https://www.google.com/maps/search/Jaipur+Rajasthan+302026',
    priceRange: '$$',
    servesCuisine: undefined,
    // Business categories
    additionalType: [
      'https://schema.org/GeneralContractor',
      'https://schema.org/HomeAndConstructionBusiness',
    ],
    keywords:
      'Industrial Construction Jaipur, Solar EPC Rajasthan, Pipeline Contractor Jaipur, Industrial Infrastructure Rajasthan, Fiber Maintenance, Electrical Contractor, Civil Construction Jaipur',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.name,
    description: SITE.tagline,
    publisher: { '@id': `${SITE.domain}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.domain}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  },
];

// ─── Build BreadcrumbList JSON-LD ─────────────────────────────────────────────
export const buildBreadcrumb = (crumbs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: crumb.path ? `${SITE.domain}${crumb.path}` : undefined,
  })),
});

// ─── useSEO hook ──────────────────────────────────────────────────────────────
/**
 * @param {object} config
 * @param {string}   config.title           - Page <title> (without site name suffix)
 * @param {string}   config.description     - Meta description (120-160 chars)
 * @param {string}   [config.keywords]      - Meta keywords (comma-separated)
 * @param {string}   [config.canonicalPath] - Canonical path e.g. '/services/solar-epc'
 * @param {string}   [config.ogImage]       - Absolute URL of OG image
 * @param {string}   [config.ogType]        - 'website' | 'article' | 'product'
 * @param {Array}    [config.breadcrumbs]   - [{ name, path }] for BreadcrumbList
 * @param {object[]} [config.structuredData]- Extra JSON-LD objects array
 * @param {boolean}  [config.noIndex]       - Set true to noindex (admin pages etc)
 */
export const useSEO = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage,
  ogType = 'website',
  breadcrumbs,
  structuredData = [],
  noIndex = false,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE.name}`
    : `${SITE.name} | ${SITE.tagline}`;

  const canonical = canonicalPath
    ? `${SITE.domain}${canonicalPath}`
    : SITE.domain;

  const image = ogImage || SITE.ogImage;

  // Build all JSON-LD blocks
  const allSchemas = [
    ...(breadcrumbs ? [buildBreadcrumb(breadcrumbs)] : []),
    ...structuredData,
  ];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [canonicalPath]);

  // Return a Helmet component to be rendered by the calling page
  return { fullTitle, canonical, image, allSchemas, description, keywords, ogType, noIndex };
};

// ─── SEOHead component (convenience wrapper) ──────────────────────────────────
/**
 * Drop this directly into a page's JSX return to inject all SEO tags.
 * Usage: <SEOHead title="..." description="..." ... />
 */
export const SEOHead = (props) => {
  const { fullTitle, canonical, image, allSchemas, description, keywords, ogType, noIndex } =
    useSEO(props);

  return (
    <Helmet>
      {/* ── Primary ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={canonical} />

      {/* ── Hreflang ── */}
      <link rel="alternate" hrefLang="en-IN" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={ogType} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"   content={fullTitle} />
      <meta property="og:site_name"   content={SITE.name} />
      <meta property="og:locale"      content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={canonical} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
      <meta name="twitter:image:alt"   content={fullTitle} />

      {/* ── JSON-LD ── */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
