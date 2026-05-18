import { Users, Briefcase, Folders, MessageSquare, User } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Services', value: '6', icon: <Briefcase size={24} />, color: 'bg-blue-500' },
    { title: 'Projects Completed', value: '52', icon: <Folders size={24} />, color: 'bg-green-500' },
    { title: 'Team Members', value: '24', icon: <Users size={24} />, color: 'bg-purple-500' },
    { title: 'New Inquiries', value: '12', icon: <MessageSquare size={24} />, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back to the admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`w-12 h-12 rounded-full ${stat.color} text-white flex items-center justify-center mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Inquiries</h3>
            <button className="text-sm text-corporateBlue font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start p-4 border border-gray-50 rounded-md bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mr-3 flex-shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Amit Kumar</h4>
                  <p className="text-xs text-slate-500 mb-1">Inquiry for Solar Piling</p>
                  <p className="text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Active Projects</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">L&T Pipeline Section B</span>
                <span className="text-slate-500">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-corporateBlue h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Waaree Solar Park Phase 1</span>
                <span className="text-slate-500">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-corporateGold h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
