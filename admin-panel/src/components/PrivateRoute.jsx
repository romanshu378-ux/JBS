import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  
  if (!adminInfo) {
    return <Navigate to="/login" replace />;
  }

  try {
    const parsed = JSON.parse(adminInfo);
    if (!parsed || !parsed.token) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
