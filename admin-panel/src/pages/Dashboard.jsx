import { useState, useEffect } from 'react';
import { Users, Briefcase, Folders, MessageSquare, User, Image as ImageIcon, Star, Clock } from 'lucide-react';
import API, { BASE_URL } from '../api/index.js';

const Dashboard = () => {
  const [data, setData] = useState({
    services: 0,
    projects: 0,
    team: 0,
    gallery: 0,
    testimonials: 0,
    inquiries: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/dashboard');
        const dashboardData = res.data.data;
        
        if (dashboardData) {
          setData(dashboardData.counts);
          setRecentInquiries(dashboardData.recentInquiries || []);
          setRecentProjects(dashboardData.recentProjects || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const imgSrc = (path) => {
    if (!path) return '';
    const cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('http')) return cleanPath;
    const url = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `${url}${finalPath}`;
  };

  const stats = [
    { title: 'Total Services', value: data.services, icon: <Briefcase size={24} />, color: 'bg-blue-500' },
    { title: 'Total Projects', value: data.projects, icon: <Folders size={24} />, color: 'bg-green-500' },
    { title: 'Team Members', value: data.team, icon: <Users size={24} />, color: 'bg-purple-500' },
    { title: 'Total Inquiries', value: data.inquiries, icon: <MessageSquare size={24} />, color: 'bg-yellow-500' },
    { title: 'Gallery Images', value: data.gallery, icon: <ImageIcon size={24} />, color: 'bg-indigo-500' },
    { title: 'Testimonials', value: data.testimonials, icon: <Star size={24} />, color: 'bg-pink-500' },
  ];

  const timeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 30) return "Just now";
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-slate-500 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back to the admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-full ${stat.color} text-white flex items-center justify-center mr-4 flex-shrink-0`}>
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
        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Inquiries</h3>
          </div>
          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <p className="text-slate-500 text-sm">No recent inquiries.</p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start p-4 border border-gray-50 rounded-md bg-gray-50/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-800 truncate">{inquiry.name}</h4>
                    <p className="text-xs text-slate-500 mb-1 truncate">{inquiry.subject || 'No Subject'}</p>
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock size={12} className="mr-1" />
                      {timeAgo(inquiry.createdAt)}
                    </div>
                  </div>
                  <div className="ml-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${inquiry.status === 'New' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {inquiry.status || 'New'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Latest Projects</h3>
          </div>
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <p className="text-slate-500 text-sm">No projects added yet.</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-center p-3 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 mr-4 flex items-center justify-center overflow-hidden border border-gray-200">
                    {project.image ? (
                       <img src={imgSrc(project.image)} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <Folders size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-800 truncate">{project.title}</h4>
                    <p className="text-xs text-corporateGold font-medium truncate">{project.category}</p>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(project.createdAt || new Date()).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
