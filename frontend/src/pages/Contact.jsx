import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import API, { cachedGet } from '../api/index.js';
import SEOHead, { SITE } from '../hooks/useSEO.jsx';

// ContactPage + LocalBusiness schema with full verified address
const buildContactSchema = (settings) => [
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE.domain}/contact#webpage`,
    url: `${SITE.domain}/contact`,
    name: `Contact ${settings?.company_name || SITE.name} — Get a Free Quote`,
    description:
      `Contact ${settings?.company_name || SITE.name} for industrial infrastructure, Solar EPC, pipeline laying, civil construction, and electrical work inquiries in Jaipur, Rajasthan.`,
    isPartOf: { '@id': `${SITE.domain}/#website` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE.domain },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE.domain}/contact` },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.domain}/#organization`,
    name: settings?.company_name || SITE.name,
    telephone: settings?.phone    || SITE.phone,
    email:     settings?.email    || SITE.email,
    taxID:     SITE.gst,
    address: {
      '@type': 'PostalAddress',
      streetAddress:   'Plot No. D-32A, Narottampura, Vastu Nagar Phase-3, Bad Ke Balaji, Jaisinghpura',
      addressLocality: 'Jaipur',
      addressRegion:   'Rajasthan',
      postalCode:      '302026',
      addressCountry:  'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone:    settings?.phone || SITE.phone,
      contactType:  'customer service',
      areaServed:   ['IN'],
      availableLanguage: ['Hindi', 'English'],
    },
    url: SITE.domain,
  },
];

const Contact = () => {
  const [formData, setFormData]   = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings]   = useState(null);

  // ── Load settings (phone / email / address) ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchSettings = async () => {
      try {
        const res = await cachedGet('/settings');
        if (!cancelled) setSettings(res.data.data);
      } catch (_err) {
        // Non-critical — fall back to SITE constants below
      }
    };
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/inquiries', formData);
      alert('Thank you for your inquiry. We will get back to you shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resolve dynamic values with SITE fallbacks
  const phone   = settings?.phone   || SITE.phone;
  const email   = settings?.email   || SITE.email;
  const address = settings?.address || `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`;

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* ── SEO Head ── */}
      <SEOHead
        title="Contact Us — Get a Free Quote for Industrial & Renewable Energy Services"
        description={`Contact ${settings?.company_name || SITE.name} in Jaipur, Rajasthan for Solar EPC, Water Pipeline, Civil Construction, Fiber Maintenance & Electrical work inquiries. Call ${phone} or send us a message.`}
        keywords="Contact Janki Ballabh Services, Industrial Services Inquiry Jaipur, Solar EPC Quote Rajasthan, Pipeline Contractor Contact, Civil Construction Inquiry Jaipur"
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home',    path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
        structuredData={buildContactSchema(settings)}
      />

      <div className="container mx-auto px-4">
        {/* ── Breadcrumb nav ── */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-corporateBlue transition-colors">Home</a></li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-corporateBlue font-medium">Contact</li>
          </ol>
        </nav>

        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Get in touch with our team in Jaipur for your next industrial infrastructure or renewable energy project. We provide free consultations and site surveys.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <aside className="lg:col-span-1 space-y-8">
            <address className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 not-italic">
              <h2 className="text-2xl font-bold text-corporateBlue mb-6">Contact Information</h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-corporateBlue/5 rounded-full flex items-center justify-center text-corporateBlue flex-shrink-0 mr-4" aria-hidden="true">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Head Office</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-corporateBlue/5 rounded-full flex items-center justify-center text-corporateBlue flex-shrink-0 mr-4" aria-hidden="true">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone Number</h3>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-slate-600 hover:text-corporateBlue transition-colors"
                      aria-label={`Call ${settings?.company_name || SITE.name}`}
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-corporateBlue/5 rounded-full flex items-center justify-center text-corporateBlue flex-shrink-0 mr-4" aria-hidden="true">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email Address</h3>
                    <a
                      href={`mailto:${email}`}
                      className="text-slate-600 hover:text-corporateBlue transition-colors break-all"
                      aria-label={`Email ${settings?.company_name || SITE.name}`}
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <h3 className="font-semibold text-slate-800 mb-1 text-sm">GST Number</h3>
                  <p className="text-slate-500 text-sm font-mono">{SITE.gst}</p>
                </div>
              </div>
            </address>

            <div className="bg-corporateBlue text-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-corporateGold">Working Hours</h3>
              <p className="mb-2 flex justify-between text-sm"><span>Mon – Sat:</span> <span>9:00 AM – 6:00 PM</span></p>
              <p className="flex justify-between text-gray-400 text-sm"><span>Sunday:</span> <span>Closed</span></p>
            </div>
          </aside>

          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-corporateBlue mb-6">Send an Inquiry</h2>
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-label="Contact inquiry form"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue"
                    placeholder="+91 0000000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="contact-service" className="block text-sm font-medium text-slate-700 mb-2">Service Interested In</label>
                  <select
                    id="contact-service"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    aria-label="Select the service you are interested in"
                  >
                    <option value="">Select a service</option>
                    <option value="Water Pipeline Laying">Water Pipeline Laying</option>
                    <option value="Civil Construction">Civil Construction</option>
                    <option value="Solar Piling & EPC">Solar Piling &amp; EPC</option>
                    <option value="Electrical Work">AC/DC Electrical Work</option>
                    <option value="Fiber Maintenance">Fiber Maintenance</option>
                    <option value="MMS Structure Work">MMS Structure Work</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue"
                  placeholder="Tell us about your project requirements, location, and timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  aria-required="true"
                ></textarea>
              </div>
              <button
                id="contact-submit"
                disabled={isSubmitting}
                type="submit"
                aria-label={`Submit your inquiry to ${settings?.company_name || SITE.name}`}
                className="bg-corporateBlue hover:bg-corporateBlue-light text-white font-semibold py-3 px-8 rounded-sm transition-colors flex items-center justify-center w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4 mr-2" aria-hidden="true" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>

        {/* ── Google Maps ── */}
        <div className="mt-16 rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-slate-100 flex items-center justify-center" style={{ height: '450px' }}>
          {settings ? (
            <iframe
              title={`${settings?.company_name || SITE.name} office location`}
              src={
                settings?.google_map_embed?.includes('/embed')
                  ? settings.google_map_embed
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.2!2d75.7479!3d26.8318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ5JzU0LjUiTiA3NcKwNDQnNTIuNSJF!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
              }
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="text-slate-400 flex flex-col items-center">
              <MapPin size={48} className="mb-4 opacity-50" />
              <p>Location map not available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
