import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Download, Phone, MapPin, Instagram } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import Navbar from '../../components/ui/Navbar';
import Scene from '../../components/3d/Scene';
import LightModeBackground from '../../components/3d/LightModeBackground';
import ScrollToTop from '../../components/ui/ScrollToTop';
import AboutSection from '../../components/sections/AboutSection';
import SpecializationSection from '../../components/sections/SpecializationSection';
import TechStackSection from '../../components/sections/TechStackSection';
import ProjectsSection from '../../components/sections/ProjectsSection';
import ExperienceSection from '../../components/sections/ExperienceSection';
import EducationSection from '../../components/sections/EducationSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import { 
  getProjects, 
  getTechStack,
  getExperience,
  getEducation,
  getTestimonials,
  getCertificates,
  getAbout,
  sendMessage,
  type Project,
  type TechStack,
  type Experience,
  type Education,
  type Testimonial,
  type Certificate,
  type About
} from '../../services/portfolioService';
import CertificatesSection from '../../components/sections/CertificatesSection';

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageSent, setMessageSent] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projectsData,
          techStackData,
          experienceData,
          educationData,
          testimonialsData,
          certificatesData,
          aboutData
        ] = await Promise.all([
          getProjects(),
          getTechStack(),
          getExperience(),
          getEducation(),
          getTestimonials(),
          getCertificates(),
          getAbout()
        ]);

        setProjects(projectsData);
        setTechStack(techStackData);
        setExperience(experienceData);
        setEducation(educationData);
        setTestimonials(testimonialsData);
        setCertificates(certificatesData);
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !about) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text-primary dark:text-text-primary-dark">
      <Navbar />
      <ScrollToTop />

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale, y }}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <Scene />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            {about.fullName}
          </motion.h1>
          <TypeAnimation
            sequence={
              about.title
                ? about.title.split(',').flatMap((text) => [text.trim(), 1000])
                : []
            }
            wrapper="h2"
            speed={50}
            className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark mb-8"
            repeat={Infinity}
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
          >
            <Button className="rounded-full group transition-all duration-300 transform hover:scale-105">
              <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Download CV
            </Button>
            <Button variant="secondary" className="rounded-full group transition-all duration-300 transform hover:scale-105">
              <Mail className="mr-2 h-4 w-4 group-hover:animate-pulse" />
              Contact Me
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <SocialLink href={about.social?.github || '#'} icon={<Github />} />
            <SocialLink href={about.social?.linkedin || '#'} icon={<Linkedin />} />
            {about.social?.twitter && (
              <SocialLink href={about.social.twitter} icon={<Instagram/>} />
            )}
          </motion.div>
        </div>

        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-scroll"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Content Sections */}
      <AboutSection about={about} />
      <SpecializationSection />
      <TechStackSection techStack={techStack} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experience} />
      <EducationSection education={education} />
      <CertificatesSection />
      <TestimonialsSection testimonials={testimonials} />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="relative z-10 dark:hidden">
          <LightModeBackground />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <motion.a
                    whileHover={{ x: 10 }}
                    href={`mailto:${about.email}`}
                    className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    {about.email}
                  </motion.a>
                  {about.phone && (
                    <motion.a
                      whileHover={{ x: 10 }}
                      href={`tel:${about.phone}`}
                      className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      {about.phone}
                    </motion.a>
                  )}
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 text-lg"
                  >
                    <MapPin className="h-5 w-5" />
                    {about.location}
                  </motion.div>
                </div>
                <div className="flex gap-4 pt-4">
                  <SocialLink href={about.social?.github || '#'} icon={<Github />} />
                  <SocialLink href={about.social?.linkedin || '#'} icon={<Instagram />} />
                  {about.social?.twitter && (
                    <SocialLink href={about.social.twitter} icon={<Twitter />} />
                  )}
                </div>
              </div>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  try {
                    await sendMessage(
                      formData.get('name') as string,
                      formData.get('email') as string,
                      formData.get('message') as string
                    );
                    form.reset();
                    setMessageSent(true);
                    setTimeout(() => setMessageSent(false), 5000);
                  } catch (error) {
                    alert('Failed to send message. Please try again.');
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full rounded-lg">Send Message</Button>
                {messageSent && (
                  <p className="text-green-600 dark:text-green-400 mt-2 text-center font-semibold">
                    Message sent successfully!
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white">© {new Date().getFullYear()} {about.fullName}. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <SocialLink href={about.social?.github || '#'} icon={<Github className="h-5 w-5 text-white" />} />
              <SocialLink href={about.social?.linkedin || '#'} icon={<Linkedin className="h-5 w-5 text-white" />} />
              {about.social?.twitter && (
                <SocialLink href={about.social.twitter} icon={<Instagram className="h-5 w-5 text-white" />} />
              )}
              <a href={`mailto:${about.email}`} className="text-white hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-primary transition-colors"
  >
    {icon}
  </motion.a>
);

export default Portfolio;
