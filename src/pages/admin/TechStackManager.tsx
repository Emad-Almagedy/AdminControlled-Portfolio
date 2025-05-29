import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

interface TechStack {
  _id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: number;
}

const TechStackManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [techStack, setTechStack] = useState<TechStack[]>([]);

  // Helper to get id for API calls
  const getId = (item: TechStack) => item._id;
  const [formData, setFormData] = useState<Partial<TechStack>>({
    name: '',
    icon: '',
    category: 'frontend',
    proficiency: 50,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchTechStack();
    }
  }, [isAuthenticated, navigate]);

  const fetchTechStack = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/techstack`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTechStack(data);
      } else {
        setTechStack([]);
      }
    } catch (error) {
      console.error('Error fetching tech stack:', error);
      showToast('Error fetching tech stack.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    if (name === 'proficiency') {
      setFormData({ ...formData, proficiency: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEdit = (item: TechStack) => {
    setFormData({
      name: item.name,
      icon: item.icon,
      category: item.category,
      proficiency: item.proficiency,
    });
    setIsEditing(true);
    setEditId(getId(item));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tech stack item?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/techstack/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Failed to delete tech stack item.', 'error');
      } else {
        showToast('Tech stack item deleted successfully.', 'success');
        fetchTechStack();
      }
    } catch (error) {
      console.error('Error deleting tech stack item:', error);
      showToast('Error deleting tech stack item.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/techstack/${editId}`
        : `${import.meta.env.VITE_API_BASE_URL}/techstack`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast('Failed to save tech stack item.', 'error');
      } else {
        showToast('Tech stack item saved successfully.', 'success');
        fetchTechStack();
        setFormData({
          name: '',
          icon: '',
          category: 'frontend',
          proficiency: 50,
        });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (error) {
      console.error('Error saving tech stack item:', error);
      showToast('Error saving tech stack item.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Tech Stack</h1>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Update Tech Stack' : 'Add Tech Stack'}
      >
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Name</label>
          <Input
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Icon URL</label>
          <Input
            name="icon"
            value={formData.icon || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Category</label>
          <select
            name="category"
            value={formData.category || 'frontend'}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="tools">Tools</option>
            <option value="other">Other</option>
          </select>
        </div>
      </FormLayout>

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Tech Stack</h2>
        {isLoading ? (
          <p>Loading tech stack...</p>
        ) : techStack.length === 0 ? (
          <p>No tech stack items found.</p>
        ) : (
          <ul className="space-y-4">
            {techStack.map(item => (
              <li key={item._id} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{item.name}</h3>
                <p className="text-text-primary dark:text-text-primary-dark">Category: {item.category}</p>
                <p className="text-text-primary dark:text-text-primary-dark">Proficiency: {item.proficiency}</p>
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

export default TechStackManager;
