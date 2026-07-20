import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import API from '../api/index.js';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const adminInfoStr = localStorage.getItem('adminInfo');
      
      if (!adminInfoStr) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const parsed = JSON.parse(adminInfoStr);
        if (!parsed || !parsed.token) {
          localStorage.removeItem('adminInfo');
          sessionStorage.clear();
          setIsAuthenticated(false);
          return;
        }

        // Call backend to verify token validity
        await API.get('/auth/profile');
        setIsAuthenticated(true);
      } catch (error) {
        // If 401, the interceptor will handle redirect, but we clear it here too
        localStorage.removeItem('adminInfo');
        sessionStorage.clear();
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-corporateBlue"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
