import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
  image?: string;
}

import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const CertificatesManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Helper to get id for API calls
  const getId = (item: Certificate) => item._id;

  const [formData, setFormData] = useState<Partial<Certificate>>({
    title: '',
    issuer: '',
    date: '',
    url: '',
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchCertificates();
    }
  }, [isAuthenticated, navigate]);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      } else {
        setCertificates([]);
        showToast('Failed to fetch certificates.', 'error');
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      showToast('Error fetching certificates.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item: Certificate) => {
    setFormData({
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      url: item.url || '',
      image: item.image || '',
    });
    setIsEditing(true);
    setEditId(getId(item));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Failed to delete certificate.', 'error');
      } else {
        showToast('Certificate deleted successfully.', 'success');
        fetchCertificates();
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      showToast('Error deleting certificate.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/certificates/${editId}`
        : `${import.meta.env.VITE_API_BASE_URL}/certificates`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast('Failed to save certificate.', 'error');
      } else {
        showToast('Certificate saved successfully.', 'success');
        fetchCertificates();
        setFormData({
          title: '',
          issuer: '',
          date: '',
          url: '',
          image: '',
        });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (error) {
      console.error('Error saving certificate:', error);
      showToast('Error saving certificate.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Certificates</h1>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-full p-2 bg-gray-200 dark:bg-gray-700"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Update Certificate' : 'Add Certificate'}
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
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Issuer</label>
          <Input
            name="issuer"
            value={formData.issuer || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Date</label>
          <Input
            name="date"
            type="text"
            value={formData.date || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">URL</label>
          <Input
            name="url"
            value={formData.url || ''}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Image URL</label>
          <Input
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            className=""
          />
        </div>
      </FormLayout>

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Certificates</h2>
        {isLoading ? (
          <p>Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          <ul className="space-y-4">
            {certificates.map(item => (
              <li key={getId(item)} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{item.title}</h3>
                <p className="text-text-primary dark:text-text-primary-dark">{item.issuer}</p>
                <p className="text-text-primary dark:text-text-primary-dark">{item.date}</p>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    View Certificate
                  </a>
                )}
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain mt-2" />
                )}
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
                    onClick={() => handleDelete(getId(item))}
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

export default CertificatesManager;
