import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Folders, Users, MessageSquare, LogOut, Menu, FileText, Settings, Image as ImageIcon, Star } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const adminInfoStr = localStorage.getItem('adminInfo');
  const adminInfo = adminInfoStr ? JSON.parse(adminInfoStr) : null;

  if (!adminInfo || !adminInfo.token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Services', path: '/services', icon: <Briefcase size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Folders size={20} /> },
    { name: 'Team', path: '/team', icon: <Users size={20} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Testimonials', path: '/testimonials', icon: <Star size={20} /> },
    { name: 'Inquiries', path: '/inquiries', icon: <MessageSquare size={20} /> },
    { name: 'Website Content', path: '/content', icon: <FileText size={20} /> },
    { name: 'SEO Settings', path: '/seo', icon: <Settings size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`bg-corporateBlue text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
          {sidebarOpen && <span className="font-heading font-bold text-lg text-corporateGold truncate">Admin Portal</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-corporateGold">
            <Menu size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-corporateGold text-corporateBlue font-semibold' : 'hover:bg-white/10'}`}
                    title={!sidebarOpen ? item.name : ''}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="ml-4">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center px-4 py-3 text-red-300 hover:bg-white/10 hover:text-red-200 rounded-md transition-colors w-full text-left">
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col min-h-screen`}>
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Admin Dashboard'}
          </h2>
          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-600 mr-4">{adminInfo.username || 'Admin User'}</span>
            <div className="w-8 h-8 rounded-full bg-corporateBlue text-white flex items-center justify-center font-bold">
              {(adminInfo.username || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-6 flex-1 bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
