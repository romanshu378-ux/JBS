import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { cachedGet } from '../api/index.js';

const DEFAULT_WHATSAPP = '919079139959';

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP);

  useEffect(() => {
    let cancelled = false;
    const fetchSettings = async () => {
      try {
        const res = await cachedGet('/settings');
        const num = res?.data?.data?.whatsapp_number;
        if (!cancelled && num) {
          // Normalise: strip non-digits, ensure country code present
          const clean = num.replace(/\D/g, '');
          setWhatsappNumber(clean || DEFAULT_WHATSAPP);
        }
      } catch (_err) {
        // Fall back to default number
      }
    };
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;
