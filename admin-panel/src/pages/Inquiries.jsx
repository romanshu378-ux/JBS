import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, MessageSquare } from 'lucide-react';
import API from '../api/index.js';
import Modal from '../components/Modal';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    try {
      const { data } = await API.get('/inquiries');
      setInquiries(data.data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await API.delete(`/inquiries/${id}`);
        fetchInquiries();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const handleView = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
    
    // Optionally, if there's a status field, update it to Read
    // if (inquiry.status === 'New') {
    //   await API.put(`/inquiries/${inquiry.id}`, { status: 'Read' });
    //   fetchInquiries();
    // }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inq.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2">
           <MessageSquare size={24} /> Customer Inquiries
        </h2>
      </div>
      
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, or service..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-corporateBlue" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <button className="flex items-center border border-gray-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors text-slate-600 font-medium">
            <Filter size={18} className="mr-2" /> Filter
         </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50">
              <th className="p-4 font-semibold text-slate-700">Date</th>
              <th className="p-4 font-semibold text-slate-700">Name</th>
              <th className="p-4 font-semibold text-slate-700">Service</th>
              <th className="p-4 font-semibold text-slate-700">Email</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading inquiries...</td></tr>
            ) : filteredInquiries.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No inquiries found.</td></tr>
            ) : (
              filteredInquiries.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-slate-50/50">
                  <td className="p-4 text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-slate-800">{item.name}</td>
                  <td className="p-4 text-slate-600 text-sm">{item.service || 'General'}</td>
                  <td className="p-4 text-slate-600 text-sm">{item.email}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleView(item)} className="text-slate-500 hover:text-corporateBlue mr-3" title="View"><Eye size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-500" title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Inquiry Details">
        {selectedInquiry && (
          <div className="space-y-6 text-slate-800">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</p>
                <p className="font-medium">{selectedInquiry.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</p>
                <p className="font-medium">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium">
                  <a href={`mailto:${selectedInquiry.email}`} className="text-corporateBlue hover:underline">{selectedInquiry.email}</a>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="font-medium">
                   {selectedInquiry.phone ? (
                      <a href={`tel:${selectedInquiry.phone}`} className="text-corporateBlue hover:underline">{selectedInquiry.phone}</a>
                   ) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Requested</p>
               <span className="bg-corporateGold/20 text-corporateBlue px-3 py-1 rounded-full font-medium text-sm">
                  {selectedInquiry.service || 'General Inquiry'}
               </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</p>
              <div className="bg-white border border-gray-200 p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                {selectedInquiry.message || 'No message provided.'}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-6">
              <button onClick={() => handleDelete(selectedInquiry.id)} className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors font-medium">
                <Trash2 size={16} className="mr-2" /> Delete Inquiry
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-corporateBlue text-white rounded-md hover:bg-corporateBlue-light transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inquiries;
