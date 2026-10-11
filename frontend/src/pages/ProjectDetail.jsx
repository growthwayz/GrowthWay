import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ArrowLeft } from 'lucide-react';
import MicroInteractions from '../components/MicroInteractions';

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-gw-canvas flex flex-col items-center justify-center p-6 text-center">
        <MicroInteractions />
        <h1 className="font-display text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/work" className="text-gw-olive uppercase tracking-widest text-sm font-semibold hover:underline">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gw-canvas min-h-screen text-gw-ink">
      <MicroInteractions />
      <nav className="h-20 border-b border-gw-line flex items-center px-6 md:px-18">
        <Link to="/work" className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold hover:text-gw-olive transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Work
        </Link>
      </nav>
      
      <main className="py-24 max-w-[1000px] mx-auto px-5">
        <span className="text-gw-muted font-display text-2xl mb-4 block">0{project.id} —</span>
        <h1 className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-8 leading-none">
          {project.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-16">
          {project.categories.map(cat => (
            <span key={cat} className="text-xs border border-gw-line px-4 py-2 uppercase tracking-widest">{cat}</span>
          ))}
        </div>

        <div className="aspect-video w-full bg-gw-muted/10 mb-16 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
             <h2 className="font-display text-3xl font-bold mb-6">The Challenge</h2>
             <p className="text-gw-charcoal text-lg leading-relaxed mb-8">
               {project.description} [This is a placeholder for the full case study content. Real Growthway project data will populate this section with the strategy, creative direction, and execution details.]
             </p>
          </div>
          <div className="md:col-span-1 border-l border-gw-line pl-8">
            <h3 className="text-xs uppercase tracking-widest text-gw-muted mb-6">Project Metadata</h3>
            
            <div className="mb-6">
              <span className="block text-[10px] uppercase tracking-widest text-gw-muted mb-1">Client</span>
              <span className="font-medium text-sm">{project.metadata.client}</span>
            </div>
            
            <div className="mb-6">
              <span className="block text-[10px] uppercase tracking-widest text-gw-muted mb-1">Role</span>
              <span className="font-medium text-sm">{project.metadata.role}</span>
            </div>
            
            <div className="mb-6">
              <span className="block text-[10px] uppercase tracking-widest text-gw-muted mb-1">Year</span>
              <span className="font-medium text-sm">{project.metadata.year}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;

