import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import API from '../api/index.js';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(credentials.username && credentials.password) {
      try {
        setLoading(true);
        setError('');
        const { data } = await API.post('/auth/login', credentials);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-corporateBlue p-6 text-center">
          <h2 className="text-2xl font-heading font-bold text-white">Admin Portal</h2>
          <p className="text-corporateGold text-sm font-semibold tracking-wider uppercase mt-1">Janki Ballabh Services</p>
        </div>
        
        <div className="p-8">
          {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><span className="block sm:inline">{error}</span></div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required
                  className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" 
                  placeholder="admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue" 
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-corporateGold hover:bg-yellow-500 text-corporateBlue font-bold py-3 rounded-md transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
