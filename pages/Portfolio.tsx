import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, WHATSAPP_LINK } from '../constants';

const Portfolio: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-dark pt-32 pb-24 px-6 relative">
      <div className="container mx-auto">
        <div className="mb-16">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Selected Works
          </motion.h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            A curation of high-performance websites and digital experiences built for growth-focused brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 border border-white/10 cursor-pointer"
                onClick={() => window.open(project.url, '_blank')}
              >
                <div className="absolute inset-0 bg-gray-800 transition-colors duration-500 group-hover:bg-gray-700">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundColor: project.color }}></div>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="text-white" size={24} />
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5">
                  {project.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Have a project in mind?</h3>
          <button 
             onClick={() => window.open(WHATSAPP_LINK, '_blank')}
             className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:bg-white hover:text-brand-primary transition-all duration-300"
          >
            Start a Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;