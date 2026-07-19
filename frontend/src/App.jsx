import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const Projects = lazy(() => import('./pages/Projects'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-slate-200 border-t-corporateBlue rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary message="The application encountered an unexpected error. Please refresh the page.">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="about" element={<ErrorBoundary><About /></ErrorBoundary>} />
              <Route path="services" element={<ErrorBoundary message="Failed to load services. Please try again."><Services /></ErrorBoundary>} />
              <Route path="services/:slug" element={<ErrorBoundary message="Failed to load service details."><ServiceDetails /></ErrorBoundary>} />
              <Route path="projects" element={<ErrorBoundary message="Failed to load projects. Please try again."><Projects /></ErrorBoundary>} />
              <Route path="team" element={<ErrorBoundary><Team /></ErrorBoundary>} />
              <Route path="contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
