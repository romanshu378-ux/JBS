import { useState, useEffect } from 'react';
import { Factory, Zap, Droplets, HardHat, Building2, Sun } from 'lucide-react';
import API, { BASE_URL } from '../api/index.js';

const iconMap = {
  'Droplets': <Droplets size={40} />,
  'Building2': <Building2 size={40} />,
  'Zap': <Zap size={40} />,
  'Sun': <Sun size={40} />,
  'Factory': <Factory size={40} />,
  'HardHat': <HardHat size={40} />
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get('/services');
        setServices(data.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4 text-center">Our Services</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">Comprehensive industrial and renewable energy solutions delivered with expertise and precision.</p>
        
        {loading ? (
          <div className="text-center py-12 text-slate-600 text-xl font-medium">Loading Services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-xl font-medium">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {service.image ? (
                  <img loading="lazy" src={service.image ? `${BASE_URL}${service.image.replace(/\\/g, '/')}` : ''} alt={service.title || "Service image"} className="w-full h-48 object-cover rounded-md mb-6" />
                ) : (
                  <div className="text-corporateGold mb-6">{iconMap[service.icon] || <HardHat size={40} />}</div>
                )}
                <h2 className="text-2xl font-bold text-corporateBlue mb-4">{service.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-6">{service.shortDescription || service.description}</p>
                <Link to={`/services/${service.slug}`} className="text-corporateBlue font-semibold flex items-center hover:text-corporateGold transition-colors">
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
