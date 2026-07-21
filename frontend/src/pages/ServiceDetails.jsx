import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Settings, ShieldCheck, Wrench, BatteryCharging, FileText, Banknote, HardHat, Car, Building2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { cachedGet, getImageUrl, buildCloudinaryUrl } from '../api/index.js';
import SEOHead, { SITE } from '../hooks/useSEO.jsx';

const iconMap = {
  Zap: <Zap className="w-8 h-8 text-corporateGold" />,
  Settings: <Settings className="w-8 h-8 text-corporateGold" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-corporateGold" />,
  Wrench: <Wrench className="w-8 h-8 text-corporateGold" />,
  BatteryCharging: <BatteryCharging className="w-8 h-8 text-corporateGold" />,
  FileText: <FileText className="w-8 h-8 text-corporateGold" />,
  Banknote: <Banknote className="w-8 h-8 text-corporateGold" />,
  HardHat: <HardHat className="w-8 h-8 text-corporateGold" />,
  Car: <Car className="w-8 h-8 text-corporateGold" />,
  Building2: <Building2 className="w-8 h-8 text-corporateGold" />,
  Phone: <Phone className="w-8 h-8 text-corporateGold" />,
  CheckCircle2: <CheckCircle2 className="w-8 h-8 text-corporateGold" />
};

const ServiceDetails = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchService = async () => {
      try {
        const { data } = await cachedGet(`/services/${slug}`);

        if (cancelled) return;

        setService(data.data);
      } catch (_e) {
        // silently handled — component renders 'Service Not Found' when service is null
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    fetchService();
    window.scrollTo(0, 0);
    return () => { cancelled = true; };
  }, [slug]);


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50" aria-label="Loading service details">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-corporateBlue rounded-full animate-spin" role="status"></div>
    </div>
  );

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <SEOHead
        title="Service Not Found"
        description="The requested service page could not be found."
        canonicalPath="/services"
        noIndex={true}
      />
      <h1 className="text-2xl text-slate-500 font-bold">Service Not Found</h1>
    </div>
  );

  // Build Service JSON-LD schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.domain}/services/${slug}#service`,
    name: service.title,
    description: service.seoDescription || service.description,
    url: `${SITE.domain}/services/${slug}`,
    provider: { '@id': `${SITE.domain}/#organization` },
    areaServed: {
      '@type': 'State',
      name: 'Rajasthan',
      containedIn: { '@type': 'Country', name: 'India' },
    },
    ...(service.image && {
      image: {
        '@type': 'ImageObject',
        url: getImageUrl(service.image, SITE.ogImage),
        name: service.title,
      },
    }),
    ...(service.features?.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title} Features`,
        itemListElement: service.features.map((f, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: { '@type': 'Service', name: f.title },
        })),
      },
    }),
  };

  // Build FAQ schema if service has FAQs
  const faqSchema = service.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  const pageTitle    = service.seoTitle       || `${service.title} Services in Jaipur, Rajasthan`;
  const pageDesc     = service.seoDescription || `${service.description} — Janki Ballabh Services, Jaipur.`;
  const pageKeywords = service.seoKeywords    || `${service.title}, industrial services Jaipur, ${service.category?.title || ''} Rajasthan`;
  const pageImage    = getImageUrl(service.image, SITE.ogImage);

  return (
    <div className="w-full overflow-hidden bg-slate-50">
      {/* ── SEO Head ── */}
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        keywords={pageKeywords}
        canonicalPath={`/services/${slug}`}
        ogImage={pageImage}
        ogType="article"
        breadcrumbs={[
          { name: 'Home',              path: '/' },
          { name: 'Services',          path: '/services' },
          { name: service.title,       path: `/services/${slug}` },
        ]}
        structuredData={[serviceSchema, ...(faqSchema ? [faqSchema] : [])]}
      />

      {/* ── Breadcrumb nav ── */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-28 pb-2">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li><Link to="/" className="hover:text-corporateBlue transition-colors">Home</Link></li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li><Link to="/services" className="hover:text-corporateBlue transition-colors">Services</Link></li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li className="text-corporateBlue font-medium truncate max-w-[200px]">{service.title}</li>
        </ol>
      </nav>

      {/* ── Hero Section ── */}
      <section aria-label={`${service.title} — hero`} className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 flex items-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-corporateBlue/95 to-corporateBlue/60 z-10"></div>
          <img 
            src={buildCloudinaryUrl(
              getImageUrl(service.image, 'https://images.unsplash.com/photo-1662991033282-4df45eabcf25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'),
              { width: 1200 }
            )}
            alt={`${service.title} service — Janki Ballabh Services, Jaipur`}
            width="2070"
            height="1380"
            className="w-full h-full object-cover opacity-60"
            fetchPriority="high"
            decoding="async"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1662991033282-4df45eabcf25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {service.category && (
                <span className="inline-block py-1 px-3 rounded-full bg-corporateGold/20 text-corporateGold border border-corporateGold/30 text-sm font-semibold mb-6 tracking-wide uppercase">
                  {service.category.title}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl leading-relaxed">
                {service.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" aria-label={`Get a free quote for ${service.title}`} className="bg-corporateGold hover:bg-yellow-500 text-corporateBlue font-bold py-4 px-8 rounded-sm transition-all flex items-center justify-center shadow-lg">
                  Get Free Quote <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Link>
                <Link to="/contact" aria-label="Request a site survey" className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-4 px-8 rounded-sm transition-all text-center">
                  Request Site Survey
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features & Industries ── */}
      {(service.features?.length > 0 || service.industries?.length > 0) && (
        <section aria-label="Features and industries served" className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {service.features?.length > 0 && (
                <div>
                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-corporateBlue mb-4">Features &amp; Services</h2>
                    <div className="w-20 h-1 bg-corporateGold rounded"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.features.map(f => (
                      <div key={f.id} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-corporateGold mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-700 font-medium">{f.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {service.industries?.length > 0 && (
                <div>
                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-corporateBlue mb-4">Industries We Serve</h2>
                    <div className="w-20 h-1 bg-corporateGold rounded"></div>
                  </div>
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {service.industries.map(ind => (
                        <div key={ind.id} className="flex items-center p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <Building2 className="w-5 h-5 text-corporateBlue mr-3 opacity-70" aria-hidden="true" />
                          <span className="text-slate-800 font-semibold">{ind.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      {service.process?.length > 0 && (
        <section aria-label="Our installation and project process" className="py-24 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Our Process</h2>
              <p className="text-slate-600 text-lg">A systematic approach ensuring flawless execution of your infrastructure.</p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {service.process.map((step, index) => (
                  <div key={step.id} className="relative group">
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-lg text-center hover:shadow-lg hover:border-corporateGold transition-all duration-300 h-full flex flex-col justify-center">
                      <div className="text-sm font-bold text-corporateGold uppercase tracking-wider mb-2">Step {step.stepNumber || index + 1}</div>
                      <h3 className="text-xl font-bold text-corporateBlue mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ── */}
      {service.benefits?.length > 0 && (
        <section aria-label="Key benefits of our service" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Key Benefits</h2>
              <p className="text-slate-600 text-lg">Why leading brands trust us with their critical infrastructure.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {service.benefits.map(benefit => (
                <div key={benefit.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-corporateBlue/5 flex items-center justify-center mb-4" aria-hidden="true">
                    {iconMap[benefit.icon] || <ShieldCheck className="w-8 h-8 text-corporateGold" />}
                  </div>
                  <h3 className="text-lg font-bold text-corporateBlue">{benefit.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ section (if available) ── */}
      {service.faqs?.length > 0 && (
        <section aria-label="Frequently asked questions" className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-corporateBlue mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <details key={i} className="bg-slate-50 border border-gray-100 rounded-lg p-6 group" itemScope itemType="https://schema.org/Question">
                  <summary className="font-semibold text-corporateBlue cursor-pointer list-none flex justify-between items-center" itemProp="name">
                    {faq.question}
                    <span className="ml-4 text-corporateGold" aria-hidden="true">+</span>
                  </summary>
                  <div className="mt-4 text-slate-600" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section aria-label="Get a quote CTA" className="py-20 bg-corporateGold relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10" aria-hidden="true">
          <Zap size={400} className="text-corporateBlue transform translate-x-1/4 -translate-y-1/4 rotate-12" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-corporateBlue/80 mb-10 max-w-3xl mx-auto font-medium">Contact our experts in Jaipur today for a free consultation and complete turnkey solution.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" aria-label="Get a free quote for your industrial project" className="bg-corporateBlue hover:bg-corporateBlue-light text-white font-bold py-4 px-10 rounded-sm text-lg transition-colors inline-block shadow-lg">
              Get Free Quote
            </Link>
            <Link to="/contact" aria-label="Contact Janki Ballabh Services now" className="bg-white hover:bg-slate-100 text-corporateBlue font-bold py-4 px-10 rounded-sm text-lg transition-colors inline-block shadow-md">
              Contact Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;
