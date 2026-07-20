import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Edit, Trash2, Plus, Upload, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import API, { getImageUrl, isLegacyUpload } from '../api/index.js';
import Modal from '../components/Modal';
import { ToastContainer, useToast } from '../components/Toast';

const BLANK = { title: '', category: '' };

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const GALLERY_FALLBACK = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=60';

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/gallery');
      setImages(data.data || []);
    } catch { toast.error('Failed to load gallery.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const openAdd = () => {
    setFormData(BLANK); setEditingId(null); setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEdit = (img) => {
    setFormData({ title: img.title || '', category: img.category || '' });
    setEditingId(img.id); setImageFile(null);
    setImagePreview(img.image && !isLegacyUpload(img.image) ? getImageUrl(img.image, GALLERY_FALLBACK) : null);
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
    if (!editingId && !imageFile) { toast.error('Please select an image.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editingId) { await API.put(`/gallery/${editingId}`, fd); toast.success('Image updated!'); }
      else { await API.post('/gallery', fd); toast.success('Image added!'); }
      closeModal(); fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed. Are you logged in?');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try { await API.delete(`/gallery/${id}`); toast.success('Image deleted.'); fetchImages(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  const set = (k) => (e) => setFormData((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="relative">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2"><ImageIcon size={24} /> Gallery</h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-corporateBlue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            <Plus size={16} /> Add Image
          </button>
        </div>

        {loading ? <p className="text-slate-400 text-center py-12">Loading...</p>
          : images.length === 0 ? <p className="text-slate-400 text-center py-12">No images yet. Add your first!</p>
          : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <motion.div key={img.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="h-40 bg-slate-200">
                    <img src={img.image && !isLegacyUpload(img.image) ? getImageUrl(img.image, GALLERY_FALLBACK) : GALLERY_FALLBACK} alt={img.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button onClick={() => openEdit(img)} className="bg-white text-corporateBlue p-2 rounded-full hover:bg-blue-50" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(img.id)} className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50" title="Delete"><Trash2 size={15} /></button>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="font-semibold text-slate-800 text-sm truncate">{img.title || 'Untitled'}</p>
                    {img.category && <p className="text-xs text-slate-400">{img.category}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Image' : 'Add Image'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" value={formData.title} onChange={set('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input type="text" value={formData.category} onChange={set('category')} placeholder="e.g. Site Photos, Events" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Image {!editingId && <span className="text-red-500">*</span>}</label>
            {editingId && (() => {
              const item = images.find(i => i.id === editingId);
              return item && isLegacyUpload(item.image);
            })() && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 mb-3 text-xs">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <span><strong>Image from old local storage.</strong> The original file no longer exists on the server. Please upload a new image — it will be permanently stored on Cloudinary.</span>
              </div>
            )}
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-lg border border-gray-200 mb-3" />}
            <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-4 text-sm text-slate-600 transition-colors w-full">
              <Upload size={18} />
              <span>{imageFile ? imageFile.name : editingId ? 'Replace image (optional)' : 'Choose image file...'}</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-corporateBlue hover:bg-blue-900 text-white rounded-lg text-sm font-semibold disabled:opacity-60">
              {submitting ? 'Uploading...' : editingId ? 'Save Changes' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGallery;
