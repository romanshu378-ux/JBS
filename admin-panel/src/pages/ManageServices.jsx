import { useState, useEffect, useRef } from 'react';
import { Briefcase, Edit, Trash2, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import API, { BASE_URL } from '../api';
import Modal from '../components/Modal';
import { ToastContainer, useToast } from '../components/Toast';

const BLANK = { title: '', description: '', icon: '', features: '' };

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const imgSrc = (path) => (!path ? '' : path.startsWith('http') ? path : `${BASE_URL}${path.replace(/\\/g, '/')}`);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/services');
      setServices(data.data || []);
    } catch {
      toast.error('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => {
    setFormData(BLANK);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setFormData({
      title: s.title,
      description: s.description,
      icon: s.icon || '',
      features: Array.isArray(s.features) ? s.features.join(', ') : (s.features || ''),
    });
    setEditingId(s.id);
    setImageFile(null);
    setImagePreview(s.image ? imgSrc(s.image) : null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('icon', formData.icon);
      // Send features as a JSON string so backend can parse it
      const featArr = formData.features ? formData.features.split(',').map((f) => f.trim()).filter(Boolean) : [];
      fd.append('features', JSON.stringify(featArr));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await API.put(`/services/${editingId}`, fd);
        toast.success('Service updated!');
      } else {
        await API.post('/services', fd);
        toast.success('Service added!');
      }
      closeModal();
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed. Check you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await API.delete(`/services/${id}`);
      toast.success('Service deleted.');
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const set = (k) => (e) => setFormData((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="relative">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2">
            <Briefcase size={24} /> Manage Services
          </h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-corporateBlue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            <Plus size={16} /> Add Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-400">No services yet. Add one!</td></tr>
              ) : (
                services.map((s) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {s.image && (
                          <img src={imgSrc(s.image)} alt={s.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{s.title}</p>
                          <p className="text-xs text-slate-400 truncate max-w-xs">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">Active</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(s)} className="inline-flex items-center gap-1 text-corporateBlue hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium text-sm mr-2 transition-colors">
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(s.id, s.title)} className="inline-flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Title <span className="text-red-500">*</span></label>
            <input required type="text" value={formData.title} onChange={set('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea required rows="4" value={formData.description} onChange={set('description')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name</label>
              <input type="text" value={formData.icon} onChange={set('icon')} placeholder="e.g. FaTools" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Features (comma-separated)</label>
              <input type="text" value={formData.features} onChange={set('features')} placeholder="Safety, Quality, 24/7 Support" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Service Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
              )}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-slate-600 transition-colors flex-1">
                <Upload size={16} />
                <span className="truncate">{imageFile ? imageFile.name : 'Click to choose image...'}</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-corporateBlue hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageServices;
