import { useState, useEffect } from 'react';
import API, { BASE_URL } from '../api/index.js';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get('/projects');
        setProjects(data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4 text-center">Project Gallery</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">A glimpse into our successful executions across various industrial sectors.</p>
        
        {loading ? (
          <div className="text-center py-12 text-slate-600 text-xl font-medium">Loading Projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-xl font-medium">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer">
                <img loading="lazy" src={project.image ? `${BASE_URL}${project.image.replace(/\\/g, '/')}` : ''} alt={project.title || "Project image"} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-corporateBlue/90 via-corporateBlue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-corporateGold font-semibold text-sm mb-1">{project.category}</span>
                  <h3 className="text-white font-bold text-xl">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
