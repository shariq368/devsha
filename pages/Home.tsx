import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { SERVICES, TESTIMONIALS, PROJECTS, WHATSAPP_LINK } from '../constants';
import { AntigravityBackground } from '../components/ui/antigravity-background';
import { Service, Project } from '../types';
import ceoImg from '../Assets/ceo.jpeg';

// Separate component for Spotlight Effect
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
      className="relative group rounded-3xl border border-white/10 bg-gray-900/50 overflow-hidden"
    >
      {/* Spotlight Gradient - Border Reveal (Neon Green: 34, 197, 94) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(34, 197, 94, 0.4), transparent 40%)`,
        }}
      />

      {/* Inner Content Container */}
      <div className="relative h-full bg-dark/95 backdrop-blur-xl p-8 rounded-[23px] m-[1px] transition-colors duration-300 group-hover:bg-dark/80">
        {/* Inner Spotlight for depth */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(34, 197, 94, 0.1), transparent 40%)`,
          }}
        />

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg shadow-brand-primary/10">
            <service.icon size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">{service.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Project Card with Parallax and Animations
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="sticky top-28 bg-dark/90 backdrop-blur-xl p-1 rounded-3xl border border-white/10 overflow-hidden shadow-2xl z-0"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center p-6 md:p-10">
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-brand-primary mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
            {project.category}
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
          >
            {project.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 mb-8 leading-relaxed text-lg"
          >
            {project.description}
          </motion.p>

          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 text-white font-semibold group/link"
          >
            <span className="border-b border-brand-primary pb-0.5 group-hover/link:text-brand-primary transition-colors">Visit Live Site</span>
            <ArrowRight size={16} className="text-brand-primary group-hover/link:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div
          className="order-1 md:order-2 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer border border-white/5 shadow-inner"
          onClick={() => window.open(project.url, '_blank')}
        >
          {/* Background Color Fallback */}
          <div className="absolute inset-0" style={{ backgroundColor: project.color + '15' }} />

          <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%] relative">
            <img
              src={project.image || `https://picsum.photos/800/600?random=${index + 50}`}
              className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700 scale-100 group-hover:scale-105 transition-transform"
              alt={project.title}
            />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:bg-brand-primary hover:text-white">
              View Project <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Section A: Hero
  const HeroSection = () => (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* CSS Linear Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E] to-[#0A0A0A] opacity-20" />
      <div className="absolute inset-0 bg-dark/80" /> {/* Overlay to ensure text readability if needed, or remove for full brightness */}

      {/* Background Animation */}
      <AntigravityBackground />

      {/* Subtle Gradient Overlay for Depth at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-dark to-transparent z-0 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hover:bg-white/10 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
            <span className="text-sm font-medium text-gray-200">Available for new projects</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold font-sans leading-tight tracking-tight mb-6 drop-shadow-lg">
            I Design & Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-[#4ADE80]">
              Digital Experiences
            </span> <br />
            That Drive Results
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-light drop-shadow-md">
            Full-Stack Developer • Designer • Growth Strategist
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/portfolio')}
              className="px-8 py-4 bg-white text-dark rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all duration-300 flex items-center gap-2 group shadow-xl shadow-brand-primary/20"
            >
              View My Work
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.open(WHATSAPP_LINK, '_blank')}
              className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            >
              Book a Call
            </button>
          </div>
        </motion.div>

        {/* Floating Cards */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden lg:block absolute left-4 bottom-32 w-64 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        >
          <div className="text-4xl font-bold text-brand-primary mb-2">10+</div>
          <div className="text-sm text-gray-300">Years of Experience in Design & Development</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="hidden lg:block absolute right-4 top-32 w-64 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        >
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-dark bg-gray-700 overflow-hidden">
                <img src={`https://picsum.photos/40/40?random=${i + 10}`} alt="Client" />
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-300">Trusted by global clients across multiple industries</div>
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

  // Section C: Featured Projects (Renamed from Selected Works)
  const PortfolioPreview = () => (
    <section className="py-24 bg-dark relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-gray-400 max-w-xl">A curated selection of high-impact digital solutions designed for growth.</p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate('/portfolio')}
            className="text-white border-b border-brand-primary pb-1 hover:text-brand-primary transition-colors flex items-center gap-2 group"
          >
            View All Projects <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Enhanced Sticky Scroll Layout */}
        <div className="space-y-32 pb-12">
          {PROJECTS.slice(0, 3).map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
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
    <section className="py-32 bg-dark relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-dark to-dark pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Ready to <span className="relative inline-block px-4">
            <svg className="absolute inset-0 w-full h-full text-brand-yellow -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q50,0 100,50 Q50,100 0,50 Z" fill="currentColor" opacity="0.8" />
            </svg>
            <span className="relative z-10 text-dark">grow</span>
          </span> your business?
        </h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open(WHATSAPP_LINK, '_blank')}
          className="px-10 py-5 bg-brand-primary text-white text-xl font-bold rounded-full shadow-2xl shadow-brand-primary/40 hover:shadow-brand-primary/60 transition-all"
        >
          Work With Muhammad Shariq →
        </motion.button>

        {/* Floating star */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-[20%] text-brand-primary"
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