const ContentManagement = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-corporateBlue">Website Content</h2>
        <button className="bg-corporateBlue hover:bg-corporateBlue-light text-white px-4 py-2 rounded-md font-medium transition-colors">Save Changes</button>
      </div>
      
      <div className="space-y-8 max-w-4xl">
        <div className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Homepage Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Heading</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="Building Reliable Infrastructure & Renewable Solutions" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subheading</label>
              <textarea rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="Professional pipeline, construction, solar and industrial services delivered with uncompromised safety, innovation and unmatched quality."></textarea>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Company Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                 <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="+91 9079139959" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                 <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="Jankiballabh2510@gmail.com" />
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Office Address</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="Janki Ballabh Services, India" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
