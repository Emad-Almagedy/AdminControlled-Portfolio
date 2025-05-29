import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  from: string;
  to: string | null;
  current: boolean;
  description: string;
}

const ExperienceManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Helper to get id for API calls
  const getId = (item: Experience) => item._id;
  const [formData, setFormData] = useState<Partial<Experience>>({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchExperiences();
    }
  }, [isAuthenticated, navigate]);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/experience`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      } else {
        setExperiences([]);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      showToast('Error fetching experiences.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (name === 'current') {
      setFormData({ ...formData, current: checked });
      if (checked) {
        setFormData({ ...formData, to: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEdit = (item: Experience) => {
    setFormData({
      title: item.title,
      company: item.company,
      location: item.location,
      from: item.from,
      to: item.to || '',
      current: item.current,
      description: item.description,
    });
    setIsEditing(true);
    setEditId(getId(item));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/experience/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Failed to delete experience.', 'error');
      } else {
        showToast('Experience deleted successfully.', 'success');
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      showToast('Error deleting experience.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/experience/${editId}`
        : `${import.meta.env.VITE_API_BASE_URL}/experience`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast('Failed to save experience.', 'error');
      } else {
        showToast('Experience saved successfully.', 'success');
        fetchExperiences();
        setFormData({
          title: '',
          company: '',
          location: '',
          from: '',
          to: '',
          current: false,
          description: '',
        });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      showToast('Error saving experience.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 pt-16 md:pt-0 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Experience</h1>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Update Experience' : 'Add Experience'}
      >
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Title</label>
          <Input
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Company</label>
          <Input
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Location</label>
          <Input
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">From</label>
          <Input
            name="from"
            type="text"
            value={formData.from || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
      {!formData.current && (
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">To</label>
          <Input
            name="to"
            type="text"
            value={formData.to || ''}
            onChange={handleChange}
            placeholder="To"
            className=""
          />
        </div>
      )}
        <div>
          <label htmlFor="current" className="inline-flex items-center space-x-2">
            {/* <input
              id="current"
              name="current"
              type="checkbox"
              checked={formData.current || false}
              onChange={handleChange}
              className="h-4 w-4"
            /> */}
            {/* <span className="text-text-primary dark:text-text-primary-dark">Current</span> */}
          </label>
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            required
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
          />
        </div>
      </FormLayout>

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Experience</h2>
        {isLoading ? (
          <p>Loading experience entries...</p>
        ) : experiences.length === 0 ? (
          <p>No experience entries found.</p>
        ) : (
          <ul className="space-y-4">
            {experiences.map(item => (
              <li key={item._id} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{item.title}</h3>
                <p className="text-text-primary dark:text-text-primary-dark">{item.company} - {item.location}</p>
                <p className="text-text-primary dark:text-text-primary-dark">{item.from} to {item.current ? 'Present' : item.to}</p>
                <p className="text-text-primary dark:text-text-primary-dark">{item.description}</p>
                <div className="mt-4 space-x-2 flex">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1 text-primary dark:text-primary-light hover:bg-primary-light hover:text-primary-dark dark:hover:bg-primary-dark dark:hover:text-primary-light transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-7l7 7" />
                    </svg>
                    <span>Edit</span>
                  </Button>
                  <Button
                    onClick={() => handleDelete(item._id)}
                    size="sm"
                    variant="destructive"
                    className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-red-900 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Delete</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ExperienceManager;
