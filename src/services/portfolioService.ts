const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface TechStack {
  id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  from: string;
  to: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  from: string;
  to: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  image?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
  image?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface About {
  fullName: string;
  title: string;
  bio: string;
  profileImage: string;
  location: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    website?: string;
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

export const getProjects = async (): Promise<Project[]> => {
  return fetchJson<Project[]>(`${API_BASE_URL}/projects`);
};

export const getTechStack = async (): Promise<TechStack[]> => {
  return fetchJson<TechStack[]>(`${API_BASE_URL}/techstack`);
};

export const getExperience = async (): Promise<Experience[]> => {
  return fetchJson<Experience[]>(`${API_BASE_URL}/experience`);
};

export const getEducation = async (): Promise<Education[]> => {
  return fetchJson<Education[]>(`${API_BASE_URL}/education`);
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  return fetchJson<Testimonial[]>(`${API_BASE_URL}/testimonials`);
};

export const getCertificates = async (): Promise<Certificate[]> => {
  return fetchJson<Certificate[]>(`${API_BASE_URL}/certificates`);
};

export const getMessages = async (): Promise<Message[]> => {
  return fetchJson<Message[]>(`${API_BASE_URL}/messages`);
};

export const getAbout = async (): Promise<About> => {
  return fetchJson<About>(`${API_BASE_URL}/about`);
};

export const sendMessage = async (name: string, email: string, message: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  return response.ok;
};
