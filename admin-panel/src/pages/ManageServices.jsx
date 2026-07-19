import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, ImageIcon, Link as LinkIcon, Settings, Layers, Wrench, CheckCircle, HelpCircle, X } from 'lucide-react';
import API, { BASE_URL } from '../api/index.js';
import { ToastContainer, useToast } from '../components/Toast.jsx';

const ManageServices = () => {
  const [view, setView] = useState('services'); // categories | services | edit-service
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  
  const [activeService, setActiveService] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); 
  const [relationsData, setRelationsData] = useState([]);
  const { toasts, removeToast, success, error } = useToast();

  // Categories Modal
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({ title: '', slug: '', description: '' });

  // Modals
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', categoryId: '', description: '', shortDescription: '' });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/service-categories');
      setCategories(data.data || []);
    } catch (e) {}
  };

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/services');
      setServices(data.data || []);
    } catch (e) {}
  };

  const fetchRelation = async (type) => {
    if (!activeService) return;
    try {
      const { data } = await API.get(`/${type}?serviceId=${activeService.id}`);
      setRelationsData(data.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    if (activeService && view === 'edit-service') {
      if (activeTab === 'features') fetchRelation('features');
      if (activeTab === 'process') fetchRelation('process');
      if (activeTab === 'industries') fetchRelation('industries');
      if (activeTab === 'benefits') fetchRelation('benefits');
      if (activeTab === 'faqs') fetchRelation('faqs');
    }
  }, [activeTab, activeService]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/service-categories', categoryFormData);
      setCategories([...categories, data.data]);
      setShowAddCategoryModal(false);
      setCategoryFormData({ title: '', slug: '', description: '' });
      success('Category created successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/service-categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      success('Category deleted successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('slug', formData.slug);
      payload.append('categoryId', formData.categoryId);
      payload.append('description', formData.description);
      payload.append('shortDescription', formData.shortDescription);
      
      if (selectedImage) {
        payload.append('image', selectedImage);
      }

      if (editServiceId) {
        const { data } = await API.put(`/services/${editServiceId}`, payload);
        setServices(services.map(s => s.id === editServiceId ? data.data : s));
        success('Service updated successfully!');
      } else {
        const { data } = await API.post('/services', payload);
        setServices([...services, data.data]);
        success('Service created successfully!');
      }
      
      setShowAddServiceModal(false);
      setFormData({ title: '', slug: '', categoryId: '', description: '', shortDescription: '' });
      setSelectedImage(null);
      setEditServiceId(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEditServiceClick = (service) => {
    setFormData({
      title: service.title,
      slug: service.slug,
      categoryId: service.categoryId,
      description: service.description || '',
      shortDescription: service.shortDescription || ''
    });
    setEditServiceId(service.id);
    setSelectedImage(null);
    setShowAddServiceModal(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
      success('Service deleted successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Services CMS</h1>
          <p className="text-gray-500 mt-1">Full control over EV & Industrial infrastructure pages.</p>
        </div>
        
        {view !== 'edit-service' && (
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setView('categories')} className={`px-4 py-2 rounded-md font-medium transition-colors ${view === 'categories' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}>Categories</button>
            <button onClick={() => setView('services')} className={`px-4 py-2 rounded-md font-medium transition-colors ${view === 'services' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}>Services</button>
          </div>
        )}
      </div>

      {view === 'categories' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Service Categories</h2>
            <button onClick={() => setShowAddCategoryModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Category</button>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3">ID</th><th className="p-3">Title</th><th className="p-3">Slug</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="p-3">#{c.id}</td>
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3 text-gray-400">{c.slug}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'services' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Services</h2>
            <button onClick={() => setShowAddServiceModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Service</button>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3">Image</th><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Featured</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">
                    {s.image ? (
                      <img src={`${BASE_URL}${s.image.replace(/\\/g, '/')}`} alt={s.title} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded"><ImageIcon className="w-5 h-5 text-gray-400" /></div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{s.title}</td>
                  <td className="p-3">{s.category?.title || 'None'}</td>
                  <td className="p-3">{s.featured ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Yes</span> : 'No'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => { setActiveService(s); setView('edit-service'); setActiveTab('details'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm transition-colors font-medium mr-2">Manage Data</button>
                    <button onClick={() => handleEditServiceClick(s)} className="text-blue-600 p-2 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteService(s.id)} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Add Category</h2>
              <button onClick={() => setShowAddCategoryModal(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" className="w-full border rounded p-2" value={categoryFormData.title} onChange={e => setCategoryFormData({...categoryFormData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input required type="text" className="w-full border rounded p-2" value={categoryFormData.slug} onChange={e => setCategoryFormData({...categoryFormData, slug: e.target.value})} />
              </div>
              <div className="pt-4 border-t flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">{editServiceId ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => { setShowAddServiceModal(false); setEditServiceId(null); }} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" className="w-full border rounded p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input required type="text" className="w-full border rounded p-2" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select required className="w-full border rounded p-2" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <textarea className="w-full border rounded p-2 h-20" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Service Image</label>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" className="w-full border rounded p-2 text-sm" onChange={e => setSelectedImage(e.target.files[0])} />
                <p className="text-xs text-gray-400 mt-1">Allowed: jpg, jpeg, png, webp. Max 5MB.</p>
              </div>
              
              <div className="pt-4 border-t flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium shadow-sm hover:bg-blue-700">{editServiceId ? 'Update Service' : 'Create Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'edit-service' && activeService && (
        <div>
          <button onClick={() => setView('services')} className="mb-4 text-gray-500 hover:text-gray-800 flex items-center text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Services</button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <h2 className="text-2xl font-bold">{activeService.title}</h2>
              <p className="text-gray-400 mt-1">/{activeService.slug}</p>
            </div>
            
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'details', label: 'Main Details', icon: Settings },
                { id: 'features', label: 'Features', icon: Wrench },
                { id: 'process', label: 'Installation Process', icon: Layers },
                { id: 'industries', label: 'Industries', icon: LinkIcon },
                { id: 'benefits', label: 'Benefits', icon: CheckCircle },
                { id: 'faqs', label: 'FAQs', icon: HelpCircle },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div><label className="block text-sm font-medium mb-1">Service Title</label><input type="text" className="w-full border rounded p-2" defaultValue={activeService.title} /></div>
                  <div><label className="block text-sm font-medium mb-1">Short Description</label><textarea className="w-full border rounded p-2 h-20" defaultValue={activeService.shortDescription} /></div>
                  <div><label className="block text-sm font-medium mb-1">Full Description</label><textarea className="w-full border rounded p-2 h-32" defaultValue={activeService.description} /></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium mb-1">SEO Title</label><input type="text" className="w-full border rounded p-2" defaultValue={activeService.seoTitle} /></div>
                    <div><label className="block text-sm font-medium mb-1">SEO Keywords</label><input type="text" className="w-full border rounded p-2" defaultValue={activeService.seoKeywords} /></div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Save Details</button>
                </div>
              )}
              
              {activeTab !== 'details' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold capitalize">Manage {activeTab}</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center font-medium"><Plus className="w-4 h-4 mr-1" /> Add New</button>
                  </div>
                  
                  {relationsData.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No {activeTab} found for this service.</div>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-t text-gray-500">
                        <tr>
                          {activeTab === 'faqs' ? (
                            <><th className="p-3">Question</th><th className="p-3">Answer</th></>
                          ) : activeTab === 'process' ? (
                            <><th className="p-3">Step</th><th className="p-3">Title</th><th className="p-3">Description</th></>
                          ) : (
                            <><th className="p-3">Title</th><th className="p-3">Icon</th></>
                          )}
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relationsData.map(item => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            {activeTab === 'faqs' ? (
                              <><td className="p-3 font-medium">{item.question}</td><td className="p-3 text-gray-500 max-w-xs truncate">{item.answer}</td></>
                            ) : activeTab === 'process' ? (
                              <><td className="p-3 font-bold text-blue-600">Step {item.stepNumber}</td><td className="p-3 font-medium">{item.title}</td><td className="p-3 text-gray-500 max-w-xs truncate">{item.description}</td></>
                            ) : (
                              <><td className="p-3 font-medium">{item.title}</td><td className="p-3 text-gray-400">{item.icon}</td></>
                            )}
                            <td className="p-3 text-right">
                              <button className="text-blue-600 mr-3"><Edit2 className="w-4 h-4" /></button>
                              <button className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
