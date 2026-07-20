import SEOHead, { SITE } from '../hooks/useSEO.js';

const About = () => {
  // AboutPage + Organization structured data
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE.domain}/about#webpage`,
    url: `${SITE.domain}/about`,
    name: 'About Janki Ballabh Services — Industrial Infrastructure Company Jaipur',
    description:
      'Learn about Janki Ballabh Services — a premier industrial infrastructure and renewable energy company in Jaipur, Rajasthan. GST: 08GBBPS0582P1ZY.',
    isPartOf: { '@id': `${SITE.domain}/#website` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE.domain },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE.domain}/about` },
      ],
    },
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* ── SEO Head ── */}
      <SEOHead
        title="About Us — Industrial Infrastructure Company in Jaipur, Rajasthan"
        description="Learn about Janki Ballabh Services — a premier industrial infrastructure and renewable energy company based in Jaipur, Rajasthan. Experts in Solar EPC, Pipeline, Civil Construction & Electrical work since 2014. GST: 08GBBPS0582P1ZY."
        keywords="About Janki Ballabh Services, Industrial Company Jaipur, Infrastructure Company Rajasthan, Solar EPC Company Jaipur, Pipeline Contractor Rajasthan"
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home',  path: '/' },
          { name: 'About', path: '/about' },
        ]}
        structuredData={[aboutSchema]}
      />

      <div className="container mx-auto px-4">
        {/* ── Page Header ── */}
        <header className="text-center mb-12">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4">
            <ol className="flex justify-center items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href="/" itemProp="item" className="hover:text-corporateBlue transition-colors">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-corporateBlue font-medium">About</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl font-heading font-bold text-corporateBlue mb-4 text-center">
            About Janki Ballabh Services
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Industrial Infrastructure &amp; Renewable Energy Company — Jaipur, Rajasthan
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* ── Main About Content ── */}
          <article className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-10">
            <h2 className="text-2xl font-bold text-corporateBlue mb-4">Who We Are</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Janki Ballabh Services is a premier <strong>industrial infrastructure and renewable energy services company</strong> headquartered in Jaipur, Rajasthan. Since our founding, we have specialised in water pipeline laying, civil construction, fiber maintenance, solar piling, MMS structure work, and AC/DC electrical work — delivering end-to-end solutions across Rajasthan and India.
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Partnering with industry giants like <strong>L&amp;T</strong> and <strong>Waaree Renewable Energy</strong>, we deliver projects with an uncompromising commitment to safety, innovation, and quality. Our team of 200+ highly skilled engineers and technicians ensures every project meets the highest standards of execution and compliance.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Registered under GST (<strong>08GBBPS0582P1ZY</strong>), our head office is located at Plot No. D-32A, Narottampura, Vastu Nagar Phase-3, Bad Ke Balaji, Jaisinghpura, Jaipur, Rajasthan — 302026.
            </p>
          </article>

          {/* ── Company Info Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-50 rounded-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-corporateBlue mb-3">Company Information</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><span className="font-semibold">Founded:</span> 2014</li>
                <li><span className="font-semibold">GST Number:</span> 08GBBPS0582P1ZY</li>
                <li><span className="font-semibold">Team Size:</span> 200+ Professionals</li>
                <li><span className="font-semibold">Projects Completed:</span> 50+</li>
                <li><span className="font-semibold">Operating Regions:</span> Rajasthan, India</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-corporateBlue mb-3">Business Categories</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>✔ Industrial Infrastructure Company</li>
                <li>✔ Solar EPC &amp; Piling Contractor</li>
                <li>✔ Water Pipeline Contractor</li>
                <li>✔ Civil Construction Company</li>
                <li>✔ AC/DC Electrical Contractor</li>
                <li>✔ Fiber Maintenance Company</li>
              </ul>
            </div>
          </div>

          {/* ── Vision / Mission / Values ── */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-slate-50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-bold text-corporateGold mb-3">Our Vision</h3>
              <p className="text-sm text-slate-600">To be the most trusted industrial infrastructure and renewable energy partner in India — delivering projects that power communities and build lasting value.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-bold text-corporateGold mb-3">Our Mission</h3>
              <p className="text-sm text-slate-600">Delivering excellence through innovative engineering, sustainable practices, and an uncompromising commitment to safety across all infrastructure sectors.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-bold text-corporateGold mb-3">Our Values</h3>
              <p className="text-sm text-slate-600">Integrity in every contract. Quality in every weld and pipeline. Total client satisfaction guaranteed — backed by 10+ years of proven delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
