import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageServices from './pages/ManageServices';
import ManageProjects from './pages/ManageProjects';
import ManageTeam from './pages/ManageTeam';
import Inquiries from './pages/Inquiries';
import ContentManagement from './pages/ContentManagement';
import SeoSettings from './pages/SeoSettings';
import ManageGallery from './pages/ManageGallery';
import ManageTestimonials from './pages/ManageTestimonials';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="team" element={<ManageTeam />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="seo" element={<SeoSettings />} />
          <Route path="gallery" element={<ManageGallery />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
