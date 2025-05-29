import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AboutData {
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
  updatedAt?: string;
}

const AboutManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AboutData>({
    fullName: '',
    title: '',
    bio: '',
    profileImage: '',
    location: '',
    email: '',
    phone: '',
    resumeUrl: '',
    social: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
  });
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchAbout();
    }
  }, [isAuthenticated, navigate]);

  const fetchAbout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/about`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        setAboutId(data._id || null);
      } else {
        setFormData({
          fullName: '',
          title: '',
          bio: '',
          profileImage: '',
          location: '',
          email: '',
          phone: '',
          resumeUrl: '',
          social: {
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
          },
        });
        setAboutId(null);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/about/${aboutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        alert('Failed to save about data.');
      } else {
        showToast('About section updated successfully.', 'success');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving about data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage About Section</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full mt-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-current" /> : <Moon size={20} className="text-current" />}
        </Button>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Save Changes"
        
      >
        <div>
          <label htmlFor="fullName" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Full Name</label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="title" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Title</label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="bio" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
          />
        </div>
        <div>
          <label htmlFor="profileImage" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Profile Image URL</label>
          <Input
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="location" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Location</label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Phone</label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label htmlFor="resumeUrl" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Resume URL</label>
          <Input
            id="resumeUrl"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label htmlFor="github" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">GitHub URL</label>
          <Input
            id="github"
            name="social.github"
            value={formData.social.github}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">LinkedIn URL</label>
          <Input
            id="linkedin"
            name="social.linkedin"
            value={formData.social.linkedin}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="twitter" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Twitter URL</label>
          <Input
            id="twitter"
            name="social.twitter"
            value={formData.social.twitter}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label htmlFor="website" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Website URL</label>
          <Input
            id="website"
            name="social.website"
            value={formData.social.website}
            onChange={handleChange}
            className=""
          />
        </div>
      </FormLayout>
    </>
  );
};

export default AboutManager;
