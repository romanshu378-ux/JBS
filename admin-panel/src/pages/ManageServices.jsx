import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Image, Link as LinkIcon, Settings, Layers, Tool, CheckCircle, HelpCircle } from 'lucide-react';
import API, { BASE_URL } from '../api';

const ManageServices = () => {
  const [view, setView] = useState('categories'); // categories | services | edit-service
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  
  const [activeService, setActiveService] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // details | features | process | industries | benefits | faq
  const [relationsData, setRelationsData] = useState([]);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Category</button>
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
                    <button className="text-blue-600 mr-3"><Edit2 className="w-4 h-4" /></button>
                    <button className="text-red-600"><Trash2 className="w-4 h-4" /></button>
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Service</button>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Featured</th><th className="p-3 text-right">Manage Relational Data</th></tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-b">
                  <td className="p-3 font-medium text-gray-800">{s.title}</td>
                  <td className="p-3">{s.category?.title || 'None'}</td>
                  <td className="p-3">{s.featured ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Yes</span> : 'No'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => { setActiveService(s); setView('edit-service'); setActiveTab('details'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm transition-colors font-medium">Manage CMS Data</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                { id: 'features', label: 'Features', icon: Tool },
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
