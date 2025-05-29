import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/ui/SectionTitle';
import { useToast } from '../../context/ToastContext';
import { Folder, Layers, Briefcase, BookOpen, MessageCircle, Award, User, FileText, Grid } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [counts, setCounts] = useState({
    projects: 0,
    techStack: 0,
    experience: 0,
    education: 0,
    testimonials: 0,
    certificates: 0,
    messages: 0,
    about: 0,
    specializations: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      const fetchCounts = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const headers = { Authorization: `Bearer ${token}` };

          const [
            projectsRes,
            techStackRes,
            experienceRes,
            educationRes,
            testimonialsRes,
            certificatesRes,
            messagesRes,
            aboutRes,
            specializationsRes,
          ] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/techstack/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/experience/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/education/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/testimonials/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/about/count`, { headers }),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/specializations/count`, { headers }),
          ]);

          const projectsCount = projectsRes.ok ? (await projectsRes.json()).count : 0;
          const techStackCount = techStackRes.ok ? (await techStackRes.json()).count : 0;
          const experienceCount = experienceRes.ok ? (await experienceRes.json()).count : 0;
          const educationCount = educationRes.ok ? (await educationRes.json()).count : 0;
          const testimonialsCount = testimonialsRes.ok ? (await testimonialsRes.json()).count : 0;
          const certificatesCount = certificatesRes.ok ? (await certificatesRes.json()).count : 0;
          const messagesCount = messagesRes.ok ? (await messagesRes.json()).count : 0;
          const aboutCount = aboutRes.ok ? (await aboutRes.json()).count : 0;
          const specializationsCount = specializationsRes.ok ? (await specializationsRes.json()).count : 0;

          setCounts({
            projects: projectsCount,
            techStack: techStackCount,
            experience: experienceCount,
            education: educationCount,
            testimonials: testimonialsCount,
            certificates: certificatesCount,
            messages: messagesCount,
            about: aboutCount,
            specializations: specializationsCount,
          });
        } catch (error) {
          console.error('Error fetching counts:', error);
          showToast('Error fetching counts.', 'error');
        }
      };

      fetchCounts();
    }
  }, [isAuthenticated, navigate]);

  const iconMap: Record<string, React.ReactNode> = {
    Projects: <Folder size={32} className="text-purple-600" />,
    'Tech Stack': <Layers size={32} className="text-purple-600" />,
    Experience: <Briefcase size={32} className="text-purple-600" />,
    Education: <BookOpen size={32} className="text-purple-600" />,
    Testimonials: <MessageCircle size={32} className="text-purple-600" />,
    Certificates: <Award size={32} className="text-purple-600" />,
    Messages: <User size={32} className="text-purple-600" />,
    About: <FileText size={32} className="text-purple-600" />,
    Specializations: <Grid size={32} className="text-purple-600" />,
  };

  const SectionCard = ({ title, count, link }: { title: string; count: number; link: string }) => {
    const navigate = useNavigate();
    return (
    <div
      className="bg-background dark:bg-background-dark rounded-lg shadow p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full sm:w-64"
      onClick={() => navigate(link)}
    >
        <div className="flex items-center space-x-4">
          <div>{iconMap[title]}</div>
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">{title}</h2>
        </div>
        <p className="text-4xl font-extrabold mt-4 text-text-primary dark:text-text-primary-dark">{count}</p>
        <Button onClick={() => navigate(link)} className="mt-4 self-center bg-purple-600 hover:bg-purple-700 text-white">
          Manage
        </Button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark text-text-primary dark:text-text-primary-dark">
      <main className="flex-1 p-8 pt-16 md:pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center max-w-7xl mx-auto">
          <SectionCard title="Projects" count={counts.projects} link="/admin/projects" />
          <SectionCard title="Tech Stack" count={counts.techStack} link="/admin/techstack" />
          <SectionCard title="Experience" count={counts.experience} link="/admin/experience" />
          <SectionCard title="Education" count={counts.education} link="/admin/education" />
          <SectionCard title="Testimonials" count={counts.testimonials} link="/admin/testimonials" />
          <SectionCard title="Certificates" count={counts.certificates} link="/admin/certificates" />
          <SectionCard title="Messages" count={counts.messages} link="/admin/messages" />
          <SectionCard title="About" count={counts.about} link="/admin/about" />
          <SectionCard title="Specializations" count={counts.specializations} link="/admin/specializations" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
