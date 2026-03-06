export interface Project {
  title: string;
  url: string;
  category: string;
  color: string;
  description: string;
  image?: string;
}

export interface Service {
  icon: any;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: string;
}