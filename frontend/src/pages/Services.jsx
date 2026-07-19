import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Zap, Droplets, HardHat, Building2, Sun, ArrowRight } from 'lucide-react';
import { cachedGet, getImageUrl } from '../api/index.js';
import SkeletonCard from '../components/SkeletonCard';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=60';

const iconMap = {
  Droplets: <Droplets size={40} />,
  Building2: <Building2 size={40} />,
  Zap: <Zap size={40} />,
  Sun: <Sun size={40} />,
  Factory: <Factory size={40} />,
  HardHat: <HardHat size={40} />,
};

// ─── Individual Service Card ──────────────────────────────────────────────────
const ServiceCard = memo(({ service }) => {
  const imageUrl = getImageUrl(service.image, '');

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {imageUrl ? (
        <img
          loading="lazy"
          src={imageUrl}
          alt={service.title || 'Service image'}
          className="w-full h-48 object-cover rounded-md mb-6"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
      ) : (
        <div className="text-corporateGold mb-6">
          {iconMap[service.icon] || <HardHat size={40} />}
        </div>
      )}
      <h2 className="text-2xl font-bold text-corporateBlue mb-4">{service.title}</h2>
      <p className="text-slate-600 leading-relaxed mb-6 flex-1">
        {service.shortDescription || service.description}
      </p>
      <Link
        to={`/services/${service.slug}`}
        className="text-corporateBlue font-semibold flex items-center hover:text-corporateGold transition-colors"
      >
        Read More <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

// ─── Services Page ────────────────────────────────────────────────────────────
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await cachedGet('/services');
        if (!cancelled) {
          setServices(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching services:', err);
          setError('Unable to load services. Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchServices();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4 text-center">
          Our Services
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
          Comprehensive industrial and renewable energy solutions delivered with expertise and precision.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="service" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-4">
              <HardHat size={48} className="mx-auto" />
            </div>
            <p className="text-slate-600 text-lg font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-corporateBlue text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90 transition-all"
            >
              Retry
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-300 mb-4">
              <HardHat size={48} className="mx-auto" />
            </div>
            <p className="text-slate-500 text-xl font-medium">No services available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Services);
