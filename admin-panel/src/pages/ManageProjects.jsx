import { useState, useEffect, useRef } from 'react';
import { Folders, Edit, Trash2, Plus, Upload, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import API, { BASE_URL } from '../api';
import Modal from '../components/Modal';
import { ToastContainer, useToast } from '../components/Toast';

const BLANK = { title: '', category: '', description: '', client: '', completionDate: '' };

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
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
  const FALLBACK = 'https://images.unsplash.com/photo-1541888081691-23a7bb7d5d85?auto=format&fit=crop&w=400&q=60';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/projects');
      setProjects(data.data || []);
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setFormData(BLANK);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setFormData({
      title: p.title,
      category: p.category,
      description: p.description || '',
      client: p.client || '',
      completionDate: p.completionDate ? p.completionDate.split('T')[0] : '',
    });
    setEditingId(p.id);
    setImageFile(null);
    setImagePreview(p.image ? imgSrc(p.image) : null);
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
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await API.put(`/projects/${editingId}`, fd);
        toast.success('Project updated!');
      } else {
        await API.post('/projects', fd);
        toast.success('Project added!');
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed. Check you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted.');
      fetchProjects();
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
            <Folders size={24} /> Manage Projects
          </h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-corporateBlue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            <Plus size={16} /> Add Project
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No projects yet. Add one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-44 bg-slate-200 relative overflow-hidden">
                  <img
                    src={p.image ? imgSrc(p.image) : FALLBACK}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK; }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">{p.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1 truncate" title={p.title}>{p.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    {p.client && <span className="flex items-center gap-1"><User size={11} />{p.client}</span>}
                    {p.completionDate && <span className="flex items-center gap-1"><Calendar size={11} />{new Date(p.completionDate).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1 text-corporateBlue hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors">
                      <Edit size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id, p.title)} className="inline-flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.title} onChange={set('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.category} onChange={set('category')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea rows="3" value={formData.description} onChange={set('description')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
              <input type="text" value={formData.client} onChange={set('client')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
              <input type="date" value={formData.completionDate} onChange={set('completionDate')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corporateBlue/30 focus:border-corporateBlue" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-20 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
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
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProjects;
