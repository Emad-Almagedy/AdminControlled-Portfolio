import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

interface Specialization {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

const SpecializationManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [formData, setFormData] = useState<Partial<Specialization>>({
    title: '',
    description: '',
    icon: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchSpecializations();
    }
  }, [isAuthenticated, navigate]);

  const fetchSpecializations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/specializations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSpecializations(data);
      } else {
        setSpecializations([]);
        showToast('Failed to fetch specializations.', 'error');
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      showToast('Error fetching specializations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item: Specialization) => {
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
    });
    setIsEditing(true);
    setEditId(item._id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this specialization?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/specializations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Failed to delete specialization.', 'error');
      } else {
        showToast('Specialization deleted successfully.', 'success');
        fetchSpecializations();
      }
    } catch (error) {
      console.error('Error deleting specialization:', error);
      showToast('Error deleting specialization.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/specializations/${editId}`
        : `${import.meta.env.VITE_API_BASE_URL}/specializations`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast('Failed to save specialization.', 'error');
      } else {
        showToast('Specialization saved successfully.', 'success');
        fetchSpecializations();
        setFormData({ title: '', description: '', icon: '' });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (error) {
      console.error('Error saving specialization:', error);
      showToast('Error saving specialization.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Specializations</h1>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Update Specialization' : 'Add Specialization'}
        className="max-w-xl mx-auto"
      >
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Title</label>
          <Input
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Icon URL</label>
          <Input
            name="icon"
            value={formData.icon || ''}
            onChange={handleChange}
            required
          />
        </div>
      </FormLayout>

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Specializations</h2>
        {isLoading ? (
          <p>Loading specializations...</p>
        ) : specializations.length === 0 ? (
          <p>No specializations found.</p>
        ) : (
          <ul className="space-y-4">
            {specializations.map(item => (
              <li key={item._id} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{item.title}</h3>
                <p className="text-text-primary dark:text-text-primary-dark">{item.description}</p>
                <img src={item.icon} alt={item.title} className="mt-2 max-h-24 rounded" />
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

export default SpecializationManager;
