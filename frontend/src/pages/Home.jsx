import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Factory, Zap, Droplets, HardHat, Building2, Sun, BatteryCharging } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cachedGet, getImageUrl } from '../api/index.js';
import SEOHead, { buildBaseSchema, SITE } from '../hooks/useSEO.js';

const iconMap = {
  'Droplets': <Droplets size={32} />,
  'Building2': <Building2 size={32} />,
  'Zap': <Zap size={32} />,
  'Sun': <Sun size={32} />,
  'Factory': <Factory size={32} />,
  'HardHat': <HardHat size={32} />
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchHomeData = async () => {
      try {
        const [servicesRes, projectsRes, galleryRes, testimonialsRes, settingsRes] = await Promise.all([
          cachedGet('/services'),
          cachedGet('/projects'),
          cachedGet('/gallery'),
          cachedGet('/testimonials'),
          cachedGet('/settings')
        ]);

        if (cancelled) return;

        setServices(servicesRes.data.data.slice(0, 6));
        setProjects(projectsRes.data.data.slice(0, 6));
        setGallery(galleryRes.data.data.slice(0, 6));
        setTestimonials(testimonialsRes.data.data.slice(0, 3));
        setSettings(settingsRes.data.data);
      } catch (_err) {
        // silently handled; loading state is cleared in finally
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHomeData();
    return () => { cancelled = true; };
  }, []);

  const partners = ['L&T India', 'Waaree Renewable Energy', 'Tata Projects', 'Adani Infrastructure'];

  // FAQ structured data for homepage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Janki Ballabh Services offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Janki Ballabh Services offers Solar EPC and Piling, Water Pipeline Laying, Civil Construction, Fiber Maintenance, MMS Structure Work, and AC/DC Electrical work across Rajasthan and India.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Janki Ballabh Services located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our head office is at Plot No. D-32A, Narottampura, Vastu Nagar Phase-3, Bad Ke Balaji, Jaisinghpura, Jaipur, Rajasthan 302026.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which industries does Janki Ballabh Services serve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We serve Solar & Renewable Energy, Municipal & Water Infrastructure, Telecom & Fiber, Industrial Construction, and Civil Engineering sectors across India.',
        },
      },
    ],
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ── SEO Head ── */}
      <SEOHead
        title="Industrial Infrastructure & Renewable Energy Solutions in Jaipur"
        description="Janki Ballabh Services — leading industrial construction company in Jaipur, Rajasthan. Experts in Solar EPC, Water Pipeline Laying, Civil Construction, Fiber Maintenance & Electrical work. Get a free quote today."
        keywords="Industrial Construction Company Jaipur, Solar EPC Company Rajasthan, Pipeline Contractor Jaipur, Industrial Infrastructure Rajasthan, Fiber Maintenance Company, Electrical Contractor Rajasthan, Civil Construction Jaipur"
        canonicalPath="/"
        breadcrumbs={[{ name: 'Home', path: '/' }]}
        structuredData={[...buildBaseSchema(), faqSchema]}
      />

      {/* ── Hero Section ── */}
      <section
        aria-label="Hero — Industrial Infrastructure Services"
        className="relative h-screen min-h-[600px] flex items-center"
      >
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-corporateBlue/90 to-corporateBlue/40 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75"
            alt="Industrial construction site — Janki Ballabh Services, Jaipur"
            width="1200"
            height="800"
            className="w-full h-full object-cover opacity-60"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-corporateGold/20 text-corporateGold border border-corporateGold/30 text-sm font-semibold mb-6 tracking-wide uppercase">
                Premier Industrial Services — Jaipur, Rajasthan
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
                {settings?.hero_title ? (
                  <span dangerouslySetInnerHTML={{ __html: settings.hero_title.replace('Infrastructure', '<span class="text-gradient-gold">Infrastructure</span>') }} />
                ) : (
                  <>Building Reliable <span className="text-gradient-gold">Infrastructure</span> &amp; Renewable Solutions</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                {settings?.hero_subtitle || 'Professional pipeline, construction, solar and industrial services delivered with uncompromised safety, innovation and unmatched quality across Rajasthan and India.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  aria-label="Get a free quote from Janki Ballabh Services"
                  className="bg-corporateGold hover:bg-yellow-500 text-corporateBlue font-bold py-4 px-8 rounded-sm transition-all flex items-center justify-center"
                >
                  Get a Free Quote <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/services"
                  aria-label="Explore our industrial and renewable energy services"
                  className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-4 px-8 rounded-sm transition-all text-center"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trusted Partners ── */}
      <section aria-label="Trusted industry partners" className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner, index) => (
              <div key={index} className="text-xl md:text-2xl font-bold font-heading text-corporateBlue flex items-center">
                <Building2 className="mr-2" aria-hidden="true" /> {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Services ── */}
      <section aria-label="Our core industrial services" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Our Core Services</h2>
            <p className="text-slate-600 text-lg">We provide end-to-end industrial infrastructure solutions across Rajasthan, specializing in renewable energy, civil engineering, pipeline laying, and fiber maintenance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              service.featured ? (
                <motion.article 
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-sm border-2 border-corporateGold hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-corporateGold text-corporateBlue text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Featured</div>
                  <div className="w-16 h-16 rounded-2xl bg-corporateBlue/5 text-corporateBlue flex items-center justify-center mb-6 group-hover:bg-corporateBlue group-hover:text-corporateGold transition-colors" aria-hidden="true">
                    {iconMap[service.icon] || <BatteryCharging size={32} />}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-corporateGold transition-colors">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.shortDescription || service.description}</p>
                  <Link to={`/services/${service.slug}`} aria-label={`Learn more about ${service.title}`} className="text-corporateBlue font-semibold flex items-center group-hover:text-corporateGold transition-colors">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.article>
              ) : (
                <motion.article 
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-corporateBlue/5 text-corporateBlue flex items-center justify-center mb-6 group-hover:bg-corporateBlue group-hover:text-corporateGold transition-colors" aria-hidden="true">
                    {iconMap[service.icon] || <HardHat size={32} />}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-corporateGold transition-colors">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.shortDescription || service.description}</p>
                  <Link to={`/services/${service.slug}`} aria-label={`Read more about ${service.title}`} className="text-corporateBlue font-semibold flex items-center group-hover:text-corporateGold transition-colors">
                    Read More <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.article>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Projects ── */}
      {projects.length > 0 && (
        <section aria-label="Recent industrial projects" className="py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Our Recent Projects</h2>
              <p className="text-slate-600 text-lg">Delivering excellence across diverse industrial sectors in Jaipur, Rajasthan and beyond.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      loading="lazy"
                      decoding="async"
                      src={getImageUrl(project.image, 'https://images.unsplash.com/photo-1541888086225-ee1ea39d4fdd?auto=format&fit=crop&w=800&q=60')} 
                      alt={`${project.title} — industrial project by Janki Ballabh Services`}
                      width="800"
                      height="480"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1541888086225-ee1ea39d4fdd?auto=format&fit=crop&w=800&q=60'; }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-corporateGold text-xs font-bold uppercase tracking-wider mb-2">{project.category}</span>
                    <h3 className="text-xl font-bold text-corporateBlue mb-3">{project.title}</h3>
                    <p className="text-slate-600 mb-6 flex-1 line-clamp-3">{project.description}</p>
                    <Link to="/projects" aria-label={`View ${project.title} project details`} className="text-corporateBlue font-semibold flex items-center group-hover:text-corporateGold transition-colors mt-auto">
                      View Project <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/projects" aria-label="View all our completed industrial projects" className="inline-block border-2 border-corporateBlue text-corporateBlue hover:bg-corporateBlue hover:text-white font-semibold py-3 px-8 rounded transition-colors">
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section aria-label="Work gallery" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Our Work Gallery</h2>
              <p className="text-slate-600 text-lg">A visual journey through our successful project executions across Rajasthan and India.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer h-64">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={getImageUrl(item.image, '')}
                    alt={item.title ? `${item.title} — Janki Ballabh Services work gallery` : 'Industrial work gallery — Janki Ballabh Services'}
                    width="600"
                    height="400"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-corporateBlue/90 via-corporateBlue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-corporateGold font-semibold text-sm mb-1">{item.category}</span>
                    <h3 className="text-white font-bold text-xl">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Partner With Us ── */}
      <section aria-label="Why choose Janki Ballabh Services" className="py-24 bg-corporateBlue text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" aria-hidden="true"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-corporateGold">Why Partner With Us?</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                At Janki Ballabh Services, we blend technical expertise with innovative execution. Our commitment to safety, quality, and timely delivery makes us the preferred choice for major infrastructure and solar EPC projects across Rajasthan and India.
              </p>
              
              <ul className="space-y-6" role="list">
                {[
                  'Proven track record with industry giants like L&T & Waaree',
                  'Uncompromising commitment to safety standards (GST: 08GBBPS0582P1ZY)',
                  'Highly skilled engineering & technical team of 200+ experts',
                  'Timely project execution and delivery across all sectors',
                  'Advanced machinery and modern construction techniques'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-corporateGold mr-4 flex-shrink-0 mt-1" aria-hidden="true" />
                    <span className="text-lg text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside aria-label="Company statistics" className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2" aria-label="50+ projects completed">50+</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Projects Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center translate-y-8">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2" aria-label="10+ years experience">10+</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2" aria-label="200+ expert staff">200+</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Expert Staff</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center translate-y-8">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2" aria-label="100% client satisfaction">100%</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Client Satisfaction</div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      
      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section aria-label="Client testimonials" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Client Testimonials</h2>
              <p className="text-slate-600 text-lg">See what our esteemed clients have to say about our industrial and renewable energy services.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testi) => (
                <article key={testi.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative" itemScope itemType="https://schema.org/Review">
                  <div className="text-corporateGold text-4xl font-serif absolute top-4 left-4 opacity-20" aria-hidden="true">&ldquo;</div>
                  <p className="text-slate-600 italic mb-6 relative z-10" itemProp="reviewBody">&ldquo;{testi.content}&rdquo;</p>
                  <div className="flex items-center" itemProp="author" itemScope itemType="https://schema.org/Person">
                    {testi.image ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={getImageUrl(testi.image, '')}
                        alt={`${testi.clientName || 'Client'} — testimonial`}
                        width="48"
                        height="48"
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-corporateBlue/10 flex items-center justify-center text-corporateBlue font-bold mr-4" aria-hidden="true">
                        {testi.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-corporateBlue text-lg" itemProp="name">{testi.clientName}</h3>
                      <p className="text-sm text-slate-500">{testi.role}, {testi.company}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section aria-label="Contact call to action" className="py-20 bg-corporateGold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-8">Ready to Start Your Next Industrial Project?</h2>
          <p className="text-xl text-corporateBlue/80 mb-10 max-w-2xl mx-auto font-medium">Contact our team of experts in Jaipur today to discuss your infrastructure or renewable energy requirements.</p>
          <Link
            to="/contact"
            aria-label="Contact Janki Ballabh Services for your industrial project"
            className="bg-corporateBlue hover:bg-corporateBlue-light text-white font-bold py-4 px-10 rounded-sm text-lg transition-colors inline-block shadow-lg"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
