import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/ui/SectionTitle';
import { useToast } from '../../context/ToastContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
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
      fetchCounts();
    }
  }, [isAuthenticated, navigate]);

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

  return (
    <>
      <SectionTitle title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {Object.entries(counts).map(([key, value]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-lg font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
              <p className="text-4xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
