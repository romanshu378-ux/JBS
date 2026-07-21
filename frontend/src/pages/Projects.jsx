import { useState, useEffect, memo } from 'react';
import { cachedGet, getImageUrl, buildCloudinaryUrl } from '../api/index.js';
import SkeletonCard from '../components/SkeletonCard';
import { HardHat } from 'lucide-react';
import SEOHead, { SITE } from '../hooks/useSEO.jsx';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1541888086225-ee1ea39d4fdd?auto=format&fit=crop&w=800&q=60';

// ─── Individual Project Card ──────────────────────────────────────────────────
const ProjectCard = memo(({ project }) => {
  const imageUrl = buildCloudinaryUrl(getImageUrl(project.image, PLACEHOLDER_IMAGE), { width: 800 });

  return (
    <article className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer">
      <img
        loading="lazy"
        decoding="async"
        src={imageUrl}
        alt={`${project.title} — industrial project by Janki Ballabh Services, Jaipur`}
        width="800"
        height="512"
        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-corporateBlue/90 via-corporateBlue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-corporateGold font-semibold text-sm mb-1">
          {project.category}
        </span>
        <h3 className="text-white font-bold text-xl">{project.title}</h3>
      </div>
    </article>
  );
});

ProjectCard.displayName = 'ProjectCard';

// ─── Projects Page ────────────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await cachedGet('/projects');
        if (!cancelled) {
          setProjects(Array.isArray(data.data) ? data.data : []);
        }
      } catch (_err) {
        if (!cancelled) {
          setError('Unable to load projects. Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  // Build ItemList schema
  const projectsListSchema = projects.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Industrial Projects by Janki Ballabh Services',
    description: 'Portfolio of completed industrial infrastructure and renewable energy projects by Janki Ballabh Services in Jaipur, Rajasthan.',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: project.title,
      description: project.description,
      ...(project.image && {
        image: {
          '@type': 'ImageObject',
          url: getImageUrl(project.image, PLACEHOLDER_IMAGE),
          name: project.title,
        },
      }),
    })),
  } : null;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* ── SEO Head ── */}
      <SEOHead
        title="Project Gallery — Industrial Infrastructure & Renewable Energy Projects Jaipur"
        description="Browse Janki Ballabh Services' project portfolio — Solar EPC installations, Water Pipeline Laying, Civil Construction, Fiber Maintenance & Electrical projects completed across Rajasthan and India."
        keywords="Industrial Projects Jaipur, Solar EPC Projects Rajasthan, Pipeline Construction Projects, Civil Construction Projects India, Infrastructure Projects Gallery"
        canonicalPath="/projects"
        breadcrumbs={[
          { name: 'Home',     path: '/' },
          { name: 'Projects', path: '/projects' },
        ]}
        structuredData={projectsListSchema ? [projectsListSchema] : []}
      />

      <div className="container mx-auto px-4">
        {/* ── Breadcrumb nav ── */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-corporateBlue transition-colors">Home</a></li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-corporateBlue font-medium">Projects</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4 text-center">
          Project Gallery
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
          A glimpse into our successful executions across various industrial sectors — Solar EPC, Pipeline, Civil Construction, and more across Rajasthan and India.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="project" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16" role="alert">
            <div className="text-slate-400 mb-4" aria-hidden="true">
              <HardHat size={48} className="mx-auto" />
            </div>
            <p className="text-slate-600 text-lg font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-corporateBlue text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90 transition-all"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-300 mb-4" aria-hidden="true">
              <HardHat size={48} className="mx-auto" />
            </div>
            <p className="text-slate-500 text-xl font-medium">No projects available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Projects);
