import React, { useState } from 'react';
import { Mail, Phone, ArrowLeft, ArrowUpRight, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_LINK } from '../constants';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Project Inquiry from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    
    // Trigger mailto
    window.location.href = `mailto:muhammadshariq368@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // Show success message and reset form
    setShowSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Hide notification after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-24 px-6 relative flex flex-col items-center">
       <div className="container mx-auto max-w-6xl">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column: Info */}
            <div>
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mb-12"
              >
                 <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Let's Work Together</h1>
                 <p className="text-xl text-gray-400 leading-relaxed">
                   Ready to grow your business? Reach out via email, WhatsApp, or fill out the form to discuss your next project.
                 </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6 mb-12 lg:mb-0">
                 {/* Email Card */}
                 <motion.a
                   href="mailto:muhammadshariq368@gmail.com"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-4 cursor-pointer"
                 >
                    <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                       <Mail size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white mb-1">Email</h3>
                       <p className="text-gray-400 text-sm mb-3">muhammadshariq368@gmail.com</p>
                       <span className="text-brand-primary text-sm font-medium flex items-center gap-2">
                         Send Email <ArrowUpRight size={14} />
                       </span>
                    </div>
                 </motion.a>

                 {/* WhatsApp Card */}
                 <motion.a
                   href={WHATSAPP_LINK}
                   target="_blank"
                   rel="noopener noreferrer"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-4 cursor-pointer"
                 >
                    <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                       <Phone size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white mb-1">WhatsApp</h3>
                       <p className="text-gray-400 text-sm mb-3">03082891023</p>
                       <span className="text-brand-green text-sm font-medium flex items-center gap-2">
                         Chat on WhatsApp <ArrowUpRight size={14} />
                       </span>
                    </div>
                 </motion.a>
              </div>
            </div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <AnimatePresence>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 overflow-hidden"
                  >
                    <CheckCircle size={20} className="shrink-0" />
                    <p className="font-medium text-sm">Message sent successfully!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors placeholder-gray-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors placeholder-gray-600"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors placeholder-gray-600 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-white text-dark font-bold py-4 rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
       </div>
    </div>
  );
}

export default Contact;