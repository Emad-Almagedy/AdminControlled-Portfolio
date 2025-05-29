  import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

import { useToast } from '../../context/ToastContext';

interface Education {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  from: string;
  to: string;
  description: string;
}

const EducationManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [educationList, setEducationList] = useState<Education[]>([]);

  // Helper to get id for API calls
  const getId = (item: Education) => item._id;
  const [formData, setFormData] = useState<Partial<Education>>({
    degree: '',
    institution: '',
    location: '',
    from: '',
    to: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchEducation();
    }
  }, [isAuthenticated, navigate]);

  const fetchEducation = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/education`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEducationList(data);
      } else {
        setEducationList([]);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
      showToast('Error fetching education entries.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item: Education) => {
    setFormData({
      degree: item.degree,
      institution: item.institution,
      location: item.location,
      from: item.from,
      to: item.to,
      description: item.description,
    });
    setIsEditing(true);
    setEditId(getId(item));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/education/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Failed to delete education entry.', 'error');
      } else {
        showToast('Education entry deleted successfully.', 'success');
        fetchEducation();
      }
    } catch (error) {
      console.error('Error deleting education entry:', error);
      showToast('Error deleting education entry.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/education/${editId}`
        : `${import.meta.env.VITE_API_BASE_URL}/education`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast('Failed to save education entry.', 'error');
      } else {
        showToast('Education entry saved successfully.', 'success');
        fetchEducation();
        setFormData({
          degree: '',
          institution: '',
          location: '',
          from: '',
          to: '',
          description: '',
        });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (error) {
      console.error('Error saving education entry:', error);
      showToast('Error saving education entry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6  pt-16 md:pt-0 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Education</h1>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Update Education' : 'Add Education'}
      >
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Degree</label>
          <Input
            name="degree"
            value={formData.degree || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Institution</label>
          <Input
            name="institution"
            value={formData.institution || ''}
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
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">To</label>
          <Input
            name="to"
            type="text"
            value={formData.to || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
          />
        </div>
      </FormLayout>

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Education</h2>
        {isLoading ? (
          <p>Loading education entries...</p>
        ) : educationList.length === 0 ? (
          <p>No education entries found.</p>
        ) : (
          <ul className="space-y-4">
            {educationList.map(item => (
              <li key={item._id} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{item.degree}</h3>
                <p className="text-text-primary dark:text-text-primary-dark">{item.institution} - {item.location}</p>
                <p className="text-text-primary dark:text-text-primary-dark">{item.from} to {item.to}</p>
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

export default EducationManager;
