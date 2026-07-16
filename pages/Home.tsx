import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ExternalLink, ArrowUpRight } from 'lucide-react';
import { SERVICES, TESTIMONIALS, PROJECTS, WHATSAPP_LINK } from '../constants';
import { AntigravityBackground } from '../components/ui/antigravity-background';
import { Service, Project } from '../types';
import ceoImg from '../Assets/ceo.jpeg';

// Separate component for Spotlight Effect
const SPOTLIGHT_COLORS = [
  "34, 197, 94",  // Green (#22C55E)
  "6, 182, 212",  // Cyan (#06B6D4)
  "236, 72, 153", // Pink (#EC4899)
  "234, 179, 8",  // Yellow (#EAB308)
  "249, 115, 22", // Orange (#F97316)
];

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const spotColor = SPOTLIGHT_COLORS[index % SPOTLIGHT_COLORS.length];
  const isHovered = opacity > 0;

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-300 hover:scale-[1.01]"
    >
      {/* Spotlight Gradient - Border Reveal */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(${spotColor}, 0.25), transparent 40%)`,
        }}
      />

      {/* Inner Content Container */}
      <div className="relative h-full bg-[#090D1A]/90 p-8 rounded-[23px] m-[1px] transition-colors duration-300 group-hover:bg-[#0C1224]/85">
        {/* Inner Spotlight for depth */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(${spotColor}, 0.08), transparent 40%)`,
          }}
        />

        <div className="relative z-10">
          <div 
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-brand-primary transition-all duration-300 shadow-lg"
            style={{ 
              backgroundColor: isHovered ? `rgba(${spotColor}, 0.15)` : '', 
              borderColor: isHovered ? `rgba(${spotColor}, 0.3)` : '',
              color: isHovered ? `rgb(${spotColor})` : 'rgba(255,255,255,0.7)',
              boxShadow: isHovered ? `0 10px 20px rgba(${spotColor}, 0.15)` : ''
            }}
          >
            <service.icon size={28} />
          </div>
          <h3 
            className="text-xl font-bold text-white mb-3 transition-colors duration-300"
            style={{ color: isHovered ? `rgb(${spotColor})` : 'white' }}
          >
            {service.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Premium Featured Project Card
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Project Number Accent */}
      <div className="absolute -top-8 left-0 text-[120px] font-black leading-none select-none pointer-events-none z-0"
        style={{ color: project.color + '08' }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10 grid md:grid-cols-5 gap-0 rounded-[32px] overflow-hidden border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm shadow-2xl"
        style={{ boxShadow: hovered ? `0 30px 80px ${project.color}18, 0 0 0 1px ${project.color}20` : '0 20px 60px rgba(0,0,0,0.4)' }}
      >
        {/* Image — takes 3/5 width on desktop */}
        <div
          className={`relative overflow-hidden cursor-pointer ${ isEven ? 'md:col-span-3 md:order-1' : 'md:col-span-3 md:order-2' } aspect-[16/10] md:aspect-auto min-h-[260px]`}
          onClick={() => window.open(project.url, '_blank')}
        >
          {/* Tinted overlay based on project color */}
          <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(135deg, ${project.color}22, transparent 60%)` }} />
          <img
            src={project.image || `https://picsum.photos/800/600?random=${index + 50}`}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
          {/* Gradient fade into info panel */}
          <div
            className="absolute inset-y-0 z-20 w-32 hidden md:block"
            style={{
              [isEven ? 'right' : 'left']: 0,
              background: isEven
                ? 'linear-gradient(to right, transparent, #0A0A0A)'
                : 'linear-gradient(to left, transparent, #0A0A0A)'
            }}
          />
          {/* Launch icon on hover */}
          <div className={`absolute top-5 z-30 transition-all duration-300 ${ hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90' } ${ isEven ? 'right-5' : 'left-5' }`}>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Info Panel — takes 2/5 width on desktop */}
        <div className={`relative flex flex-col justify-center p-8 md:p-10 ${ isEven ? 'md:col-span-2 md:order-2' : 'md:col-span-2 md:order-1' }`}>
          {/* Category badge */}
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: project.color + '18', color: project.color, border: `1px solid ${project.color}30` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
            {project.category}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug tracking-tight">
            {project.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {project.description}
          </p>

          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-2 text-sm font-semibold self-start"
            style={{ color: project.color }}
          >
            <span>Visit Live Site</span>
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Section A: Hero
  const HeroSection = () => (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-dark-navy/80 to-[#0A0A0A] opacity-20" />
      
      {/* Ambient background glow spheres (cyan, pink, yellow, emerald green) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 left-1/4 w-[350px] h-[350px] rounded-full bg-brand-cyan/10 blur-[90px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-pink/5 blur-[110px]"
        />
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, 30, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-yellow/5 blur-[90px]"
        />
        <motion.div
          animate={{
            x: [0, -20, 10, 0],
            y: [0, -40, -10, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/10 w-[250px] h-[250px] rounded-full bg-brand-primary/5 blur-[80px]"
        />
      </div>

      {/* Background Canvas Particles */}
      <AntigravityBackground />

      {/* Subtle Gradient Overlay for Depth at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-dark-deep to-transparent z-0 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl mb-8 hover:bg-white/[0.08] transition-all cursor-default shadow-lg shadow-black/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-200">Available for new projects</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold font-heading leading-tight tracking-tight mb-6 drop-shadow-xl text-white">
            I Design & Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#4ADE80] to-brand-cyan">
              Digital Experiences
            </span> <br />
            That Drive Results
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
            Full-Stack Developer • Designer • Growth Strategist
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-5 z-20">
            <button
              onClick={() => navigate('/portfolio')}
              className="px-8 py-4 bg-brand-orange text-white rounded-full font-bold hover:bg-brand-orange/90 transition-all duration-300 flex items-center gap-2 group shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:scale-[1.02]"
            >
              View Selected Work
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.open(WHATSAPP_LINK, '_blank')}
              className="px-8 py-4 bg-white/[0.04] border border-white/[0.08] text-white rounded-full font-bold hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-xl hover:scale-[1.02] flex items-center gap-1.5"
            >
              Book a Call
              <ArrowUpRight size={18} className="text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* 3 Glassmorphic Hero Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-20 text-left"
        >
          <div className="relative group rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 shadow-xl">
            <div className="text-4xl font-extrabold text-white mb-2 font-heading">10+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5">Years Experience</div>
            <p className="text-gray-400 text-sm leading-relaxed">Crafting high-performance digital products and web architectures.</p>
          </div>
          <div className="relative group rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 shadow-xl">
            <div className="text-4xl font-extrabold text-white mb-2 font-heading">6+ Major</div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-1.5">Production Projects</div>
            <p className="text-gray-400 text-sm leading-relaxed">Deployed scalable platforms with seamless client satisfaction.</p>
          </div>
          <div className="relative group rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 shadow-xl">
            <div className="text-4xl font-extrabold text-white mb-2 font-heading">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-1.5">On-Time Delivery</div>
            <p className="text-gray-400 text-sm leading-relaxed">High-touch communication with robust engineering standards.</p>
          </div>
        </motion.div>

        {/* Feature list under the cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-6 mt-8 text-[11px] font-semibold uppercase tracking-widest text-gray-400"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Clean Architecture
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
            Vite & React Stacks
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
            Dedicated Support
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Section B: Services (Now moved up)
  const ServicesSection = () => (
    <section id="services" className="py-24 bg-dark relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 h-full w-full bg-dark bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What I Can Do For Your Business</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Comprehensive digital solutions tailored to scale your brand.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <ServiceCard key={idx} service={service} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );

  // Section C: Featured Projects
  const PortfolioPreview = () => (
    <section className="py-32 bg-dark relative border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-[0.04] blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #22C55E, transparent 70%)' }} />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Selected Work
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-4">
              Featured<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#4ADE80]">Projects</span>
            </h2>
            <p className="text-gray-500 max-w-md text-base leading-relaxed">
              High-impact digital solutions engineered for performance, conversion, and lasting impressions.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => navigate('/portfolio')}
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-brand-primary hover:border-brand-primary text-white text-sm font-semibold transition-all duration-300 self-start md:self-auto"
          >
            View All Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-8">
          {PROJECTS.slice(0, 3).map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>

        {/* Bottom CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <button
            onClick={() => navigate('/portfolio')}
            className="px-8 py-3 rounded-full border border-brand-primary/40 bg-brand-primary/10 text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white transition-all duration-300"
          >
            See all {PROJECTS.length} projects →
          </button>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </motion.div>
      </div>
    </section>
  );

  // Section D: About / Mission (Professional, No Image)
  const AboutSection = () => (
    <section className="py-32 bg-dark relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(34,197,94,0.03),transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row gap-16 items-start">

              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
                  About The Developer
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  I build digital products that <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#4ADE80]">scale business</span>.
                </h2>
                <div className="flex gap-12 mt-12">
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">10+</div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">Global</div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Clients Served</div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 text-gray-400 text-lg leading-relaxed space-y-6">
                <p>
                  In a digital landscape crowded with noise, clarity is power. I specialize in cutting through the clutter to deliver websites and applications that are not just visually stunning, but functionally superior.
                </p>
                <p>
                  My philosophy is simple: <strong>Design with purpose, build for performance.</strong> I don't just write code; I engineer solutions that solve real business problems. Whether it's a high-conversion landing page or a complex web application, every pixel and every line of code serves a strategic goal.
                </p>
                <p>
                  By bridging the gap between creative design and technical engineering, I provide a holistic service that eliminates the disconnect often found in agency teams. You get the vision of a designer and the logic of a developer in one partner.
                </p>

                <div className="pt-6">
                  <button
                    onClick={() => navigate('/portfolio')}
                    className="text-white border-b border-brand-primary pb-1 hover:text-brand-primary transition-colors flex items-center gap-2"
                  >
                    See My Approach in Action <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  // Section E: Benefits Cloud
  const BenefitsSection = () => (
    <section className="py-24 bg-dark relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Why Clients Choose <span className="text-brand-primary">DevSha</span></h2>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {["Results Driven", "Fast Execution", "Conversion Focused", "Scalable Solutions", "Creative Strategy", "Tech Expertise"].map((tag, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, rotate: Math.random() * 4 - 2 }}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xl font-medium text-gray-300 cursor-default hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors"
            >
              {tag}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Section F: Testimonials
  const TestimonialsSection = () => (
    <section id="testimonials" className="py-24 bg-dark text-white relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">What People Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white/5 p-8 rounded-3xl relative border border-white/10 hover:border-brand-primary/50 transition-colors shadow-lg shadow-brand-primary/5"
            >
              {/* Doodle decoration */}
              <div className="absolute -top-4 -right-4 text-brand-primary opacity-50">
                <Star fill="currentColor" size={40} />
              </div>

              <p className="text-lg italic text-neutral-300 mb-6">"{t.quote}"</p>

              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-sm text-neutral-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Section G: Final CTA
  const FinalCTA = () => (
    <section className="py-32 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-orange/15 via-[#070A13] to-[#070A13] pointer-events-none" />
      
      {/* Background glow spots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-10 left-1/4 w-[250px] h-[250px] rounded-full bg-brand-pink/5 blur-[80px]" />
        <div className="absolute -top-10 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-cyan/5 blur-[90px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Ready to <span className="relative inline-block px-4">
            <svg className="absolute inset-0 w-full h-full text-brand-orange -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q50,0 100,50 Q50,100 0,50 Z" fill="currentColor" opacity="0.3" />
            </svg>
            <span className="relative z-10 text-white">grow</span>
          </span> your business?
        </h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open(WHATSAPP_LINK, '_blank')}
          className="px-10 py-5 bg-brand-orange text-white text-xl font-bold rounded-full shadow-2xl shadow-brand-orange/30 hover:shadow-brand-orange/50 transition-all"
        >
          Work With Muhammad Shariq →
        </motion.button>

        {/* Floating star */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-[20%] text-brand-orange/70"
        >
          <Star fill="currentColor" size={48} />
        </motion.div>
      </div>
    </section>
  );

  // Section H: CEO
  const CEOSection = () => (
    <section className="py-24 bg-dark relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-brand-primary shadow-2xl shadow-brand-primary/20">
                <img
                  src={ceoImg}
                  alt="Muhammad Shariq"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Muhammad Shariq</h2>
              <h3 className="text-xl text-brand-primary font-medium mb-6">CEO & Founder</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                "My vision is to empower businesses through innovative digital solutions. With over a decade of experience in software engineering and design, I lead DevSha with a commitment to excellence, ensuring every project we deliver drives real, measurable growth for our clients."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-dark min-h-screen">
      <HeroSection />
      <ServicesSection />
      <PortfolioPreview />
      <AboutSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CEOSection />
      <FinalCTA />
    </div>
  );
};

export default Home;