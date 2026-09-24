import { Palette, Globe, Code2, Bot, Megaphone, Smartphone, ShoppingBag } from 'lucide-react';
import { Project, Service, Testimonial } from './types';

import imgMetroStorage from './Assets/website preview picture/metrostorage&services.webp';
import imgFiberSolution from './Assets/website preview picture/fibersolution.webp';
import imgAtsons from './Assets/website preview picture/atsons.webp';
import imgLeatherLuxes from './Assets/website preview picture/leatherluxes.webp';
import imgPanaverse from './Assets/website preview picture/panaversedao.webp';
import imgKZFurniture from './Assets/website preview picture/kzfurniture.webp';
import imgEosLtd from './Assets/website preview picture/eos-ltd.webp';

export const WHATSAPP_NUMBER = "923082891023";
export const WHATSAPP_DISPLAY_NUMBER = "0308 289 1023";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = "muhammadshariq368@gmail.com";

export const PROJECTS: Project[] = [
  {
    title: "Metro Storage & Services",
    url: "https://metrostorageandservices.com",
    category: "Business Website",
    color: "#22C55E", // Updated to Neon Green
    description: "A corporate presence for a leading storage solutions provider.",
    image: imgMetroStorage
  },
  {
    title: "Fiber Solution",
    url: "https://fibersolution.vercel.app",
    category: "Security & IT Solutions",
    color: "#38BDF8", // Electric Blue / IT Infrastructure
    description: "Enterprise security, CCTV surveillance, networking & IT infrastructure platform.",
    image: imgFiberSolution
  },
  {
    title: "Atsons",
    url: "https://www.atsons.com.pk",
    category: "Corporate",
    color: "#F97316",
    description: "Professional business portfolio and services showcase.",
    image: imgAtsons
  },
  {
    title: "Leather Luxes",
    url: "https://leatherluxes.vercel.app",
    category: "Fashion Store",
    color: "#FACC15",
    description: "Premium leather goods e-commerce platform.",
    image: imgLeatherLuxes
  },
  {
    title: "Panaverse DAO",
    url: "https://shariq-panaverse-dao.vercel.app",
    category: "Web3 / DAO",
    color: "#EC4899",
    description: "Decentralized autonomous organization educational platform.",
    image: imgPanaverse
  },
  {
    title: "KZ Furniture",
    url: "https://kzfurniture.vercel.app",
    category: "Interior Design",
    color: "#D4A853",
    description: "Luxury furniture & interior design showcase with editorial projects and craftsmanship highlights.",
    image: imgKZFurniture
  },
  {
    title: "EOS Distribution",
    url: "https://eos-ltd.tech",
    category: "B2B Distribution",
    color: "#06B6D4",
    description: "Multi-vendor product feed and printer consumables management system.",
    image: imgEosLtd
  }
];

export const SERVICES: Service[] = [
  { icon: Palette, title: "Graphic Designing", description: "Visual identity and branding that speaks volumes." },
  { icon: Globe, title: "WordPress Dev", description: "Custom, scalable, and easy-to-manage websites." },
  { icon: Code2, title: "Full Stack Dev", description: "Robust web applications using modern tech stacks." },
  { icon: Bot, title: "Chatbot Dev", description: "Automated customer support and engagement agents." },
  { icon: Megaphone, title: "UGC & Ads", description: "High-converting creative ads for social growth." },
  { icon: Smartphone, title: "Social Media Marketing", description: "Strategic content to boost brand presence." },
  { icon: ShoppingBag, title: "Shopify Store", description: "High-performance e-commerce store design." },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechFlow",
    quote: "DevSha transformed our digital presence. Sales increased by 40% in the first month!",
    image: "https://picsum.photos/100/100?random=1"
  },
  {
    name: "Ahmed Ali",
    role: "Founder, UrbanStyles",
    quote: "Incredible attention to detail. The new Shopify store works seamlessly.",
    image: "https://picsum.photos/100/100?random=2"
  },
  {
    name: "Michael Chen",
    role: "Director, GreenSolutions",
    quote: "Professional, fast, and results-driven. Highly recommend Muhammad for full-stack work.",
    image: "https://picsum.photos/100/100?random=3"
  }
];