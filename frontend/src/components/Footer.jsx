import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import API from '../api/index.js';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, servicesRes] = await Promise.all([
          API.get('/settings'),
          API.get('/services')
        ]);
        setSettings(settingsRes.data.data);
        setServices(servicesRes.data.data.slice(0, 6)); // limit to 6 services for footer
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-corporateBlue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <span className="text-2xl font-heading font-bold text-white leading-tight block">{settings?.company_name || 'Janki Ballabh'}</span>
              <span className="text-sm font-semibold text-corporateGold tracking-widest uppercase">Services</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {settings?.footer_text || 'Building reliable infrastructure & renewable energy solutions. Professional pipeline, construction, solar and industrial services with safety, innovation and quality.'}
            </p>
            <div className="flex space-x-4">
              {settings?.facebook_link && <a href={settings.facebook_link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Facebook size={18} /></a>}
              {settings?.instagram_link && <a href={settings.instagram_link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Instagram size={18} /></a>}
              {settings?.linkedin_link && <a href={settings.linkedin_link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Linkedin size={18} /></a>}
              {settings?.youtube_link && <a href={settings.youtube_link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Youtube size={18} /></a>}
              {!settings?.facebook_link && !settings?.instagram_link && !settings?.linkedin_link && !settings?.youtube_link && (
                <>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Facebook size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Twitter size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Linkedin size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-corporateGold hover:text-corporateBlue transition-colors"><Instagram size={18} /></a>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-white border-b-2 border-corporateGold pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-corporateGold transition-colors">About Company</Link></li>
              <li><Link to="/services" className="hover:text-corporateGold transition-colors">Our Services</Link></li>
              <li><Link to="/projects" className="hover:text-corporateGold transition-colors">Projects Gallery</Link></li>
              <li><Link to="/team" className="hover:text-corporateGold transition-colors">Our Team</Link></li>
              <li><Link to="/contact" className="hover:text-corporateGold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-white border-b-2 border-corporateGold pb-2 inline-block">Our Services</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {services.map((service) => (
                <li key={service.id} className="hover:text-corporateGold transition-colors cursor-pointer">
                  <Link to="/services">{service.title}</Link>
                </li>
              ))}
              {services.length === 0 && (
                <>
                  <li className="hover:text-corporateGold transition-colors cursor-pointer">Water Pipeline Laying</li>
                  <li className="hover:text-corporateGold transition-colors cursor-pointer">Civil Construction</li>
                  <li className="hover:text-corporateGold transition-colors cursor-pointer">Fiber Maintenance</li>
                  <li className="hover:text-corporateGold transition-colors cursor-pointer">Solar Piling</li>
                  <li className="hover:text-corporateGold transition-colors cursor-pointer">MMS Structure Work</li>
                  <li className="hover:text-corporateGold transition-colors cursor-pointer">AC/DC Electrical Work</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-white border-b-2 border-corporateGold pb-2 inline-block">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-corporateGold flex-shrink-0 mt-0.5" />
                <span>{settings?.address || 'Head Office: Janki Ballabh Services, India'}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-corporateGold flex-shrink-0" />
                <span>{settings?.phone || '+91 9079139959'}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-corporateGold flex-shrink-0" />
                <span>{settings?.email || 'Jankiballabh2510@gmail.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.company_name || 'Janki Ballabh Services'}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
