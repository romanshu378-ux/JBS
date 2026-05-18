import { useState, useEffect, useRef } from 'react';
import { Star, Edit, Trash2, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../api';
import Modal from '../components/Modal';
import { ToastContainer, useToast } from '../components/Toast';

const BLANK = { clientName: '', role: '', company: '', content: '', rating: 5 };

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const BASE_URL = 'http://localhost:5000';
  const imgSrc = (path) => (!path ? '' : path.startsWith('http') ? path : `${BASE_URL}${path}`);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/testimonials');
      setTestimonials(data.data || []);
    } catch { toast.error('Failed to load testimonials.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openAdd = () => {
    setFormData(BLANK); setEditingId(null); setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEdit = (t) => {
    setFormData({ clientName: t.clientName, role: t.role || '', company: t.company || '', content: t.content, rating: t.rating });
    setEditingId(t.id); setImageFile(null);
    setImagePreview(t.image ? imgSrc(t.image) : null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editingId) { await API.put(`/testimonials/${editingId}`, fd); toast.success('Testimonial updated!'); }
      else { await API.post('/testimonials', fd); toast.success('Testimonial added!'); }
      closeModal(); fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed. Are you logged in?');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try { await API.delete(`/testimonials/${id}`); toast.success('Testimonial deleted.'); fetchTestimonials(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  const set = (k) => (e) => setFormData((p) => ({ ...p, [k]: e.target.value }));

  const StarRating = ({ count }) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  );

  return (
    <div className="relative">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2"><Star size={24} /> Testimonials</h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-corporateBlue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            <Plus size={16} /> Add Testimonial
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : testimonials.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No testimonials yet.</td></tr>
              ) : testimonials.map((t) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-slate-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.image ? imgSrc(t.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName)}&background=1e3a5f&color=fff`}
                        alt={t.clientName}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName)}&background=1e3a5f&color=fff`; }}
                      />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{t.clientName}</p>
                        <p className="text-xs text-slate-400">{t.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{t.company}</td>
                  <td className="p-4"><StarRating count={t.rating} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(t)} className="inline-flex items-center gap-1 text-corporateBlue hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium text-sm mr-2">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(t.id, t.clientName)} className="inline-flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client Name <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.clientName} onChange={set('clientName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input type="text" value={formData.role} onChange={set('role')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input type="text" value={formData.company} onChange={set('company')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1–5) <span className="text-red-500">*</span></label>
              <input required type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Testimonial Content <span className="text-red-500">*</span></label>
            <textarea required rows="4" value={formData.content} onChange={set('content')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Client Photo (Optional)</label>
            <div className="flex items-center gap-4">
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" />}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-slate-600 flex-1">
                <Upload size={16} />
                <span className="truncate">{imageFile ? imageFile.name : 'Choose photo...'}</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-corporateBlue hover:bg-blue-900 text-white rounded-lg text-sm font-semibold disabled:opacity-60">
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTestimonials;
