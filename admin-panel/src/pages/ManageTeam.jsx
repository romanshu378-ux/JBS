import { useState, useEffect, useRef } from 'react';
import { Users, Edit, Trash2, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../api';
import Modal from '../components/Modal';
import { ToastContainer, useToast } from '../components/Toast';

const BLANK = {
  name: '',
  role: '',
  bio: '',
  facebook: '',
  twitter: '',
  linkedin: '',
};

const ManageTeam = () => {

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const toast = useToast();

  // LIVE BACKEND URL
  const BASE_URL = 'https://jbs-pazg.onrender.com';

  // IMAGE URL FIX
  const imgSrc = (path) => {

    if (!path) return '';

    const cleanPath = path.replace(/\\/g, '/');

    return cleanPath.startsWith('http')
      ? cleanPath
      : `${BASE_URL}/${cleanPath}`;
  };

  // FETCH TEAM
  const fetchTeam = async () => {

    try {

      setLoading(true);

      const { data } = await API.get('/team');

      setTeam(data.data || []);

    } catch (error) {

      console.error(error);

      toast.error('Failed to load team members.');

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTeam();

  }, []);

  // OPEN ADD MODAL
  const openAdd = () => {

    setFormData(BLANK);

    setEditingId(null);

    setImageFile(null);

    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEdit = (member) => {

    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      facebook: member.facebook || '',
      twitter: member.twitter || '',
      linkedin: member.linkedin || '',
    });

    setEditingId(member.id);

    setImageFile(null);

    setImagePreview(member.image ? imgSrc(member.image) : null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsModalOpen(true);
  };

  // CLOSE MODAL
  const closeModal = () => {

    setIsModalOpen(false);

    setEditingId(null);
  };

  // IMAGE CHANGE
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    try {

      const fd = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        fd.append(k, v);
      });

      if (imageFile) {
        fd.append('image', imageFile);
      }

      if (editingId) {

        await API.put(`/team/${editingId}`, fd);

        toast.success('Team member updated!');

      } else {

        await API.post('/team', fd);

        toast.success('Team member added!');
      }

      closeModal();

      fetchTeam();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        'Save failed. Check login.'
      );

    } finally {

      setSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (id, name) => {

    if (!window.confirm(`Delete "${name}"?`)) return;

    try {

      await API.delete(`/team/${id}`);

      toast.success('Team member deleted.');

      fetchTeam();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        'Delete failed.'
      );
    }
  };

  // INPUT HANDLER
  const set = (k) => (e) => {

    setFormData((p) => ({
      ...p,
      [k]: e.target.value,
    }));
  };

  return (

    <div className="relative">

      <ToastContainer
        toasts={toast.toasts}
        removeToast={toast.removeToast}
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2">
            <Users size={24} />
            Manage Team
          </h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-corporateBlue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            <Plus size={16} />
            Add Member
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b-2 border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">

                <th className="p-4 font-semibold">
                  Member
                </th>

                <th className="p-4 font-semibold">
                  Role
                </th>

                <th className="p-4 font-semibold text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>

              ) : team.length === 0 ? (

                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-400">
                    No team members found.
                  </td>
                </tr>

              ) : (

                team.map((m) => (

                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-50 hover:bg-slate-50/80 transition-colors"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={
                            m.image
                              ? imgSrc(m.image)
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1e3a5f&color=fff`
                          }
                          alt={m.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1e3a5f&color=fff`;
                          }}
                        />

                        <span className="font-semibold text-slate-800">
                          {m.name}
                        </span>

                      </div>

                    </td>

                    <td className="p-4 text-slate-600 text-sm">
                      {m.role}
                    </td>

                    <td className="p-4 text-right">

                      <button
                        onClick={() => openEdit(m)}
                        className="inline-flex items-center gap-1 text-corporateBlue hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium text-sm mr-2 transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="inline-flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                    </td>

                  </motion.tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Team Member' : 'Add Team Member'}
      >

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name *
              </label>

              <input
                required
                type="text"
                value={formData.name}
                onChange={set('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role *
              </label>

              <input
                required
                type="text"
                value={formData.role}
                onChange={set('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </label>

            <textarea
              rows="3"
              value={formData.bio}
              onChange={set('bio')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Profile Photo
            </label>

            <div className="flex items-center gap-4">

              {imagePreview && (

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />

              )}

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-slate-600 transition-colors flex-1">

                <Upload size={16} />

                <span>
                  {imageFile
                    ? imageFile.name
                    : 'Click to choose image...'}
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

              </label>

            </div>

          </div>

          {/* SOCIAL LINKS */}
          <div className="border-t border-gray-100 pt-4">

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Social Links
            </p>

            <div className="grid grid-cols-3 gap-3">

              {['facebook', 'twitter', 'linkedin'].map((platform) => (

                <div key={platform}>

                  <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">
                    {platform}
                  </label>

                  <input
                    type="url"
                    value={formData[platform]}
                    onChange={set(platform)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />

                </div>

              ))}

            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">

            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-corporateBlue hover:bg-blue-900 text-white rounded-lg text-sm font-semibold"
            >
              {submitting
                ? 'Saving...'
                : editingId
                  ? 'Save Changes'
                  : 'Add Member'}
            </button>

          </div>

        </form>

      </Modal>

    </div>
  );
};

export default ManageTeam;