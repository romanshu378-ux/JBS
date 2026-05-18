const SeoSettings = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-corporateBlue">SEO Settings</h2>
        <button className="bg-corporateBlue hover:bg-corporateBlue-light text-white px-4 py-2 rounded-md font-medium transition-colors">Update SEO</button>
      </div>
      
      <p className="text-slate-500 mb-8">Manage metadata and search engine optimization settings for the main website.</p>
      
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Global Meta Title</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="Janki Ballabh Services | Industrial Infrastructure" />
            <p className="text-xs text-slate-400 mt-1">Keep it under 60 characters for best results.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Global Meta Description</label>
            <textarea rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="Professional pipeline, construction, solar and industrial services with safety, innovation and quality."></textarea>
            <p className="text-xs text-slate-400 mt-1">Keep it under 160 characters for best results.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" defaultValue="industrial services, pipeline laying, solar piling, civil construction, India" />
            <p className="text-xs text-slate-400 mt-1">Comma-separated list of keywords.</p>
          </div>
          
          <div className="pt-4 border-t border-gray-200 mt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Google Analytics</h3>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tracking ID (GA4)</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="G-XXXXXXXXXX" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSettings;
