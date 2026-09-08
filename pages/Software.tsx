import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Play, Pause, Monitor, Wifi, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WHATSAPP_LINK } from '../constants';

import schoolVideo from '../Assets/School Management Video.mp4';
import ispVideo from '../Assets/Isp Billing video.mp4';

/* ─── Software project data ─────────────────────────────────────────── */

interface SoftwareProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack: string[];
  color: string;
  icon: LucideIcon;
  video: string;
}

const SOFTWARE_PROJECTS: SoftwareProject[] = [
  {
    id: 'school-management',
    title: 'School Management Software',
    subtitle: 'Complete Academic Administration Platform',
    description:
      'A comprehensive school management system designed to digitize and streamline the entire academic workflow. From student enrollment and attendance tracking to grade management, fee collection, and parent communication — this software eliminates paper-based processes and centralizes school operations into one powerful, intuitive platform. Built to handle the unique demands of educational institutions of all sizes.',
    features: [
      'Student enrollment & profile management',
      'Automated attendance tracking system',
      'Grade book & report card generation',
      'Fee management & payment tracking',
      'Timetable & class scheduling',
      'Parent-teacher communication portal',
      'Staff & HR administration',
      'Dashboard analytics & reporting',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'REST API', 'Tailwind CSS', 'JWT Auth'],
    color: '#8B5CF6',
    icon: Monitor,
    video: schoolVideo,
  },
  {
    id: 'isp-billing',
    title: 'ISP Billing System',
    subtitle: 'Internet Service Provider Management Suite',
    description:
      'A robust billing and subscriber management system purpose-built for Internet Service Providers. This platform automates the complete billing lifecycle — from customer onboarding and plan provisioning to invoice generation, payment reconciliation, and bandwidth management. Designed to reduce manual overhead, minimize billing errors, and provide real-time visibility into subscriber activity and revenue streams.',
    features: [
      'Subscriber registration & KYC management',
      'Flexible plan & package configuration',
      'Automated invoice generation & dispatch',
      'Payment collection & reconciliation',
      'Bandwidth usage monitoring & throttling',
      'Expiry alerts & auto-renewal system',
      'Dealer & reseller management',
      'Revenue analytics & financial reports',
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'REST API', 'Tailwind CSS', 'Socket.IO'],
    color: '#06B6D4',
    icon: Wifi,
    video: ispVideo,
  },
];

/* ─── Video Player Card ──────────────────────────────────────────────── */

const VideoPlayer: React.FC<{ src: string; color: string; title: string }> = ({
  src,
  color,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative group rounded-[24px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
      {/* Decorative glow behind the video frame */}
      <div
        className="absolute -inset-1 rounded-[28px] opacity-30 blur-xl pointer-events-none -z-10"
        style={{ background: `radial-gradient(ellipse at center, ${color}40, transparent 70%)` }}
      />

      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        preload="none"
        playsInline
        className="w-full aspect-video object-cover"
        aria-label={`${title} demo video`}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Play / Pause overlay */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          hasStarted && isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
        style={{ background: hasStarted && isPlaying ? 'transparent' : 'rgba(0,0,0,0.45)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
          style={{
            borderColor: color,
            backgroundColor: `${color}25`,
            boxShadow: `0 0 40px ${color}30`,
          }}
        >
          {isPlaying ? (
            <Pause size={28} style={{ color }} />
          ) : (
            <Play size={28} className="ml-1" style={{ color }} />
          )}
        </div>
      </button>
    </div>
  );
};

/* ─── Software Project Section ───────────────────────────────────────── */

const SoftwareProjectSection: React.FC<{
  project: SoftwareProject;
  index: number;
  reversed: boolean;
}> = ({ project, index, reversed }) => {
  const Icon = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      {/* Background number accent */}
      <div
        className="absolute -top-10 left-0 text-[140px] font-black leading-none select-none pointer-events-none z-0"
        style={{ color: project.color + '06' }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10 rounded-[36px] overflow-hidden border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm shadow-2xl">
        {/* Top color bar accent */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${project.color}, transparent)` }} />

        <div className={`grid lg:grid-cols-2 gap-0 ${reversed ? '' : ''}`}>
          {/* Video Column */}
          <div className={`p-6 md:p-10 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
            <VideoPlayer src={project.video} color={project.color} title={project.title} />
          </div>

          {/* Info Column */}
          <div className={`p-8 md:p-10 lg:p-12 flex flex-col justify-center ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Category badge */}
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
              style={{
                backgroundColor: project.color + '15',
                color: project.color,
                border: `1px solid ${project.color}30`,
              }}
            >
              <Icon size={14} />
              Software Solution
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight tracking-tight">
              {project.title}
            </h2>
            <p className="text-lg font-medium mb-6" style={{ color: project.color }}>
              {project.subtitle}
            </p>

            <p className="text-gray-400 text-base leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Key Features */}
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Key Features</h4>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {project.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: project.color + '10',
                      color: project.color,
                      borderColor: project.color + '25',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Software Page ─────────────────────────────────────────────── */

const Software: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background texture grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.05] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #8B5CF6, transparent 70%)' }}
      />
      <div
        className="absolute top-[50%] right-1/4 w-[600px] h-[400px] rounded-full opacity-[0.05] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #06B6D4, transparent 70%)' }}
      />

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
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                Software Solutions
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none tracking-tighter">
                Enterprise<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-white">
                  Software
                </span>
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                Custom-built management systems engineered to automate operations, reduce overhead, and drive organizational efficiency. Each solution is tailored to solve real-world business challenges.
              </p>
            </motion.div>
          </div>

          {/* ── Software Projects ── */}
          <div className="flex flex-col gap-16">
            {SOFTWARE_PROJECTS.map((project, idx) => (
              <SoftwareProjectSection
                key={project.id}
                project={project}
                index={idx}
                reversed={idx % 2 !== 0}
              />
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 relative overflow-hidden rounded-[40px] border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-12 md:p-16 text-center"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(139,92,246,0.12), transparent 60%)' }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                Need Custom Software?
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Let's build your solution
              </h3>
              <p className="text-gray-500 mb-10 max-w-md mx-auto">
                Have an operational challenge that needs a custom software solution? Let's discuss how we can automate and optimize your business processes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}
                  className="px-8 py-4 bg-[#8B5CF6] text-white rounded-full font-bold hover:bg-[#7C3AED] transition-all duration-300 shadow-xl shadow-[#8B5CF6]/30 flex items-center gap-2 group"
                >
                  Start a Conversation
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/portfolio')}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300"
                >
                  View Web Portfolio
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Software;
