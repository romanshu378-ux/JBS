import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Factory, Zap, Droplets, HardHat, Building2, Sun, BatteryCharging } from 'lucide-react';
import { Link } from 'react-router-dom';
import API, { BASE_URL } from '../api';

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
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [servicesRes, galleryRes, testimonialsRes, settingsRes] = await Promise.all([
          API.get('/services'),
          API.get('/gallery'),
          API.get('/testimonials'),
          API.get('/settings')
        ]);
        
        setServices(servicesRes.data.data.slice(0, 6)); // Display max 6 services on home
        setGallery(galleryRes.data.data.slice(0, 6)); // Display max 6 gallery items
        setTestimonials(testimonialsRes.data.data.slice(0, 3)); // Display max 3 testimonials
        setSettings(settingsRes.data.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const partners = ['L&T India', 'Waaree Renewable Energy', 'Tata Projects', 'Adani Infrastructure'];

  return (
    <div className="w-full overflow-hidden">
      <section className="relative h-screen min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-corporateBlue/90 to-corporateBlue/40 z-10"></div>
          <img src="https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" alt="Industrial construction" className="w-full h-full object-cover opacity-60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-corporateGold/20 text-corporateGold border border-corporateGold/30 text-sm font-semibold mb-6 tracking-wide uppercase">
                Premier Industrial Services
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
                {settings?.hero_title ? (
                  <span dangerouslySetInnerHTML={{ __html: settings.hero_title.replace('Infrastructure', '<span class="text-gradient-gold">Infrastructure</span>') }} />
                ) : (
                  <>Building Reliable <span className="text-gradient-gold">Infrastructure</span> & Renewable Solutions</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                {settings?.hero_subtitle || 'Professional pipeline, construction, solar and industrial services delivered with uncompromised safety, innovation and unmatched quality.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="bg-corporateGold hover:bg-yellow-500 text-corporateBlue font-bold py-4 px-8 rounded-sm transition-all flex items-center justify-center">
                  Get a Free Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/services" className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-4 px-8 rounded-sm transition-all text-center">
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner, index) => (
              <div key={index} className="text-xl md:text-2xl font-bold font-heading text-corporateBlue flex items-center">
                <Building2 className="mr-2" /> {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Our Core Services</h2>
            <p className="text-slate-600 text-lg">We provide end-to-end industrial infrastructure solutions, specializing in renewable energy and civil engineering projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              service.featured ? (
                <motion.div 
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-sm border-2 border-corporateGold hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-corporateGold text-corporateBlue text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Featured</div>
                  <div className="w-16 h-16 rounded-2xl bg-corporateBlue/5 text-corporateBlue flex items-center justify-center mb-6 group-hover:bg-corporateBlue group-hover:text-corporateGold transition-colors">
                    {iconMap[service.icon] || <BatteryCharging size={32} />}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-corporateGold transition-colors">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.shortDescription || service.description}</p>
                  <Link to={`/services/${service.slug}`} className="text-corporateBlue font-semibold flex items-center group-hover:text-corporateGold transition-colors">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div 
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-corporateBlue/5 text-corporateBlue flex items-center justify-center mb-6 group-hover:bg-corporateBlue group-hover:text-corporateGold transition-colors">
                    {iconMap[service.icon] || <HardHat size={32} />}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-corporateGold transition-colors">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.shortDescription || service.description}</p>
                  <Link to={`/services/${service.slug}`} className="text-corporateBlue font-semibold flex items-center group-hover:text-corporateGold transition-colors">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              )
            ))}
          </div>
        </div>
      </section>
      
      {gallery.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Our Work Gallery</h2>
              <p className="text-slate-600 text-lg">A visual journey through our successful project executions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer h-64">
                  <img loading="lazy" src={item.image ? `${BASE_URL}${item.image.replace(/\\/g, '/')}` : ''} alt={item.title || "Gallery image"} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
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

      <section className="py-24 bg-corporateBlue text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-corporateGold">Why Partner With Us?</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                At Janki Ballabh Services, we blend technical expertise with innovative execution. Our commitment to safety, quality, and timely delivery makes us the preferred choice for major infrastructure and solar projects.
              </p>
              
              <ul className="space-y-6">
                {[
                  'Proven track record with industry giants like L&T & Waaree',
                  'Uncompromising commitment to safety standards',
                  'Highly skilled engineering & technical team',
                  'Timely project execution and delivery',
                  'Advanced machinery and modern techniques'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-corporateGold mr-4 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2">50+</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Projects Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center translate-y-8">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2">10+</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2">200+</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Expert Staff</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg text-center translate-y-8">
                <div className="text-4xl md:text-5xl font-bold text-corporateGold mb-2">100%</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {testimonials.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-6">Client Testimonials</h2>
              <p className="text-slate-600 text-lg">See what our esteemed clients have to say about our services.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testi) => (
                <div key={testi.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative">
                  <div className="text-corporateGold text-4xl font-serif absolute top-4 left-4 opacity-20">"</div>
                  <p className="text-slate-600 italic mb-6 relative z-10">"{testi.content}"</p>
                  <div className="flex items-center">
                    {testi.image ? (
                      <img loading="lazy" src={testi.image ? `${BASE_URL}${testi.image.replace(/\\/g, '/')}` : ''} alt={testi.clientName || "Client image"} className="w-12 h-12 rounded-full object-cover mr-4" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-corporateBlue/10 flex items-center justify-center text-corporateBlue font-bold mr-4">
                        {testi.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-corporateBlue text-lg">{testi.clientName}</h3>
                      <p className="text-sm text-slate-500">{testi.role}, {testi.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-corporateGold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-corporateBlue mb-8">Ready to Start Your Next Industrial Project?</h2>
          <p className="text-xl text-corporateBlue/80 mb-10 max-w-2xl mx-auto font-medium">Contact our team of experts today to discuss your infrastructure or renewable energy requirements.</p>
          <Link to="/contact" className="bg-corporateBlue hover:bg-corporateBlue-light text-white font-bold py-4 px-10 rounded-sm text-lg transition-colors inline-block shadow-lg">
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
