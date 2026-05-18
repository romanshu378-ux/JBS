import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  // Placeholder for Admin Profile Settings
  // App global settings are in ContentManagement and SeoSettings
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@jankiballabh.com',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile settings updated successfully!");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2">
          <SettingsIcon size={24} /> Admin Profile Settings
        </h2>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Change Password</h3>
            <p className="text-sm text-slate-500 mb-4">Leave blank if you do not wish to change the password.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-corporateBlue hover:bg-corporateBlue-light text-white px-6 py-2 rounded-md font-medium transition-colors">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
