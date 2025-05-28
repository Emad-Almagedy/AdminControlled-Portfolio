import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  image?: string;
}

const TestimonialsManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Helper to get id for API calls
  const getId = (item: Testimonial) => item._id;
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    testimonial: '',
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchTestimonials();
    }
  }, [isAuthenticated, navigate]);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:4000/api/testimonials', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      showToast('Error fetching testimonials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item: Testimonial) => {
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company,
      testimonial: item.testimonial,
      image: item.image || '',
    });
    setIsEditing(true);
    setEditId(getId(item));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:4000/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Failed to delete testimonial.', 'error');
      } else {
        showToast('Testimonial deleted successfully.', 'success');
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showToast('Error deleting testimonial.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `http://localhost:4000/api/testimonials/${editId}`
        : 'http://localhost:4000/api/testimonials';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast('Failed to save testimonial.', 'error');
      } else {
        showToast('Testimonial saved successfully.', 'success');
        fetchTestimonials();
        setFormData({
          name: '',
          role: '',
          company: '',
          testimonial: '',
          image: '',
        });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      showToast('Error saving testimonial.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-current" /> : <Moon size={20} className="text-current" />}
        </Button>
      </div>
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Update Testimonial' : 'Add Testimonial'}
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
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Role</label>
          <Input
            name="role"
            value={formData.role || ''}
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
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Testimonial</label>
          <textarea
            name="testimonial"
            value={formData.testimonial || ''}
            onChange={handleChange}
            required
            placeholder="Testimonial"
            rows={4}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Image URL (optional)</label>
          <Input
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            className=""
          />
        </div>
      </FormLayout>

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Testimonials</h2>
        {isLoading ? (
          <p>Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p>No testimonials found.</p>
        ) : (
          <ul className="space-y-4">
            {testimonials.map(item => (
              <li key={item._id} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{item.name}</h3>
                <p className="text-text-primary dark:text-text-primary-dark">{item.role} at {item.company}</p>
                <p className="text-text-primary dark:text-text-primary-dark">{item.testimonial}</p>
                {item.image && <img src={item.image} alt={item.name} className="mt-2 max-h-24 rounded" />}
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

export default TestimonialsManager;
