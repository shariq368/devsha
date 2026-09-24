import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, WHATSAPP_LINK } from '../constants';

// All unique categories
const ALL_CATEGORIES = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  /*
   * Tracked by title rather than list index: after a filter change the same
   * index points at a different project, which left the wrong card highlighted.
   */
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Scroll reset is handled centrally by <ScrollToTop />. Doing it again here
  // fought that, and now that html has scroll-behavior:smooth it would also
  // animate the jump instead of landing at the top immediately.

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #22C55E, transparent 70%)' }} />

      <div className="relative z-10 pt-32 pb-32 px-6">
        <div className="container mx-auto max-w-7xl">

          {/* ── Back Button ── */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-14 group text-sm font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </motion.button>

          {/* ── Hero Header ── */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                Portfolio
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none tracking-tighter">
                Selected<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#4ADE80] to-white">
                  Works
                </span>
              </h1>
              <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
                A curation of high-performance websites and digital experiences built for growth-focused brands.
              </p>
            </motion.div>
          </div>

          {/* ── Category Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeFilter === cat
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/25'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto text-xs text-gray-600 self-center font-medium">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </div>
          </motion.div>

          {/* ── Project Grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filtered.map((project, idx) => {
                const isHovered = hoveredKey === project.title;
                const open = () => window.open(project.url, '_blank', 'noopener,noreferrer');

                return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  onMouseEnter={() => setHoveredKey(project.title)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onFocus={() => setHoveredKey(project.title)}
                  onBlur={() => setHoveredKey(null)}
                  className="group relative flex flex-col rounded-[28px] overflow-hidden border border-white/8 bg-white/[0.03] backdrop-blur-sm cursor-pointer transition-all duration-500"
                  style={{
                    boxShadow: isHovered
                      ? `0 24px 60px ${project.color}20, 0 0 0 1px ${project.color}25`
                      : '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                  // The card was mouse-only. It is now reachable and operable
                  // from the keyboard as well.
                  role="link"
                  tabIndex={0}
                  aria-label={`${project.title} — open live site in a new tab`}
                  onClick={open}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      open();
                    }
                  }}
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Color tint overlay */}
                    <div
                      className="absolute inset-0 z-10 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(150deg, ${project.color}30 0%, transparent 60%)`,
                        opacity: isHovered ? 1 : 0.6,
                      }}
                    />
                    <img
                      src={project.image}
                      alt={`${project.title} website preview`}
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                      style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)' }}
                    />
                    {/* Bottom gradient fade */}
                    <div className="absolute inset-x-0 bottom-0 h-24 z-20 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

                    {/* Launch icon */}
                    <div
                      className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(4px)',
                      }}
                    >
                      <ArrowUpRight size={18} className="text-white" />
                    </div>

                    {/* Category badge on image */}
                    <div
                      className="absolute top-4 left-4 z-30 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
                      style={{
                        backgroundColor: project.color + '25',
                        color: project.color,
                        border: `1px solid ${project.color}40`,
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.category}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="text-xl font-bold text-white leading-snug tracking-tight transition-colors duration-300"
                        style={{ color: isHovered ? project.color : 'white' }}
                      >
                        {project.title}
                      </h3>
                      <div
                        className="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300"
                        style={{
                          borderColor: isHovered ? project.color : 'rgba(255,255,255,0.1)',
                          backgroundColor: isHovered ? project.color + '20' : 'transparent',
                        }}
                      >
                        <ExternalLink
                          size={13}
                          style={{ color: isHovered ? project.color : '#6b7280' }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Visit link */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                        style={{ color: isHovered ? project.color : '#4b5563' }}
                      >
                        Visit Live Site
                      </span>
                      <div
                        className="flex items-center gap-1 text-xs transition-all duration-300"
                        style={{ color: isHovered ? project.color : '#374151' }}
                      >
                        <span
                          className="h-px transition-all duration-300"
                          style={{
                            width: isHovered ? '32px' : '16px',
                            backgroundColor: isHovered ? project.color : '#374151',
                          }}
                        />
                        <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* ── Bottom CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 relative overflow-hidden rounded-[40px] border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-12 md:p-16 text-center"
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(34,197,94,0.12), transparent 60%)' }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                Let's Collaborate
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Have a project in mind?
              </h3>
              <p className="text-gray-500 mb-10 max-w-md mx-auto">
                Let's build something extraordinary together. Reach out and let's discuss your vision.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}
                  className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:bg-[#16a34a] transition-all duration-300 shadow-xl shadow-brand-primary/30 flex items-center gap-2 group"
                >
                  Start a Conversation
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Portfolio;