import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Thank you for your inquiry. We will get back to you shortly.');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Get in touch with us for your next industrial or renewable energy project. Our team is ready to provide expert solutions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-corporateBlue mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-corporateBlue/5 rounded-full flex items-center justify-center text-corporateBlue flex-shrink-0 mr-4">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Head Office</h4>
                    <p className="text-slate-600">Janki Ballabh Services<br/>India</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-corporateBlue/5 rounded-full flex items-center justify-center text-corporateBlue flex-shrink-0 mr-4">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Phone Number</h4>
                    <p className="text-slate-600">+91 9079139959</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-corporateBlue/5 rounded-full flex items-center justify-center text-corporateBlue flex-shrink-0 mr-4">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Email Address</h4>
                    <p className="text-slate-600">Jankiballabh2510@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-corporateBlue text-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-corporateGold">Working Hours</h3>
              <p className="mb-2 flex justify-between"><span>Mon - Sat:</span> <span>9:00 AM - 6:00 PM</span></p>
              <p className="flex justify-between text-gray-400"><span>Sunday:</span> <span>Closed</span></p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-corporateBlue mb-6">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" placeholder="+91 0000000000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Interested In</label>
                  <select className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}>
                    <option value="">Select a service</option>
                    <option value="Water Pipeline Laying">Water Pipeline Laying</option>
                    <option value="Civil Construction">Civil Construction</option>
                    <option value="Solar Piling">Solar Piling</option>
                    <option value="Electrical Work">AC/DC Electrical Work</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea required rows="5" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" placeholder="Tell us about your project requirements..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              <button disabled={isSubmitting} type="submit" className="bg-corporateBlue hover:bg-corporateBlue-light text-white font-semibold py-3 px-8 rounded-sm transition-colors flex items-center justify-center w-full md:w-auto">
                {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 bg-gray-200 w-full h-[400px] rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white flex-col">
             <MapPin size={48} className="text-corporateGold mb-4" />
             <h3 className="text-2xl font-bold">Google Maps Integration</h3>
             <p className="text-slate-400 mt-2">Embed your Google Maps iframe here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
