import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

const ProjectsManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    technologies: [],
    demoUrl: '',
    githubUrl: '',
    featured: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Helper to get id for API calls
  const getId = (project: Project) => project._id;
  const [error, setError] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [isAuthenticated, navigate]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:4000/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching projects');
      showToast(err.message || 'Error fetching projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (name === 'featured') {
      setFormData({ ...formData, featured: checked });
    } else if (name === 'technologies') {
      const techs = value.split(',').map(t => t.trim());
      setFormData({ ...formData, technologies: techs });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `http://localhost:4000/api/projects/${editId}` : 'http://localhost:4000/api/projects';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save project');
      await fetchProjects();
      showToast(isEditing ? 'Project updated successfully.' : 'Project added successfully.', 'success');
      setFormData({
        title: '',
        description: '',
        image: '',
        technologies: [],
        demoUrl: '',
        githubUrl: '',
        featured: false,
      });
      setIsEditing(false);
      setEditId(null);
    } catch (err: any) {
      setError(err.message || 'Error saving project');
      showToast(err.message || 'Error saving project', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      featured: project.featured,
    });
    setIsEditing(true);
    setEditId(getId(project));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete project');
      await fetchProjects();
      showToast('Project deleted successfully.', 'success');
    } catch (err: any) {
      setError(err.message || 'Error deleting project');
      showToast(err.message || 'Error deleting project', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fix for rendering project list keys and id usage
  const renderProjectKey = (project: Project) => project._id;

  return (
    <>
      <div className="flex justify-between items-center mb-6 text-text-primary dark:text-text-primary-dark">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
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
        submitLabel={isEditing ? 'Update Project' : 'Add Project'}
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
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-primary dark:focus:border-primary transition-colors duration-300 ease-in-out"
            rows={4}
            placeholder="Project Description"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Image URL</label>
          <Input
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Technologies (comma separated)</label>
          <Input
            name="technologies"
            value={formData.technologies ? formData.technologies.join(', ') : ''}
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Demo URL</label>
          <Input
            name="demoUrl"
            value={formData.demoUrl || ''}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">GitHub URL</label>
          <Input
            name="githubUrl"
            value={formData.githubUrl || ''}
            onChange={handleChange}
            className=""
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured || false}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary dark:focus:ring-primary"
          />
          <label htmlFor="featured" className="font-medium text-text-primary dark:text-text-primary-dark">
            Featured
          </label>
        </div>
      </FormLayout>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-8 container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Existing Projects</h2>
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className="space-y-4">
          {projects.map(project => (
            <li key={project._id} className="bg-background dark:bg-background-dark rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 border border-gray-300">
              <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{project.title}</h3>
              <p className="text-text-primary dark:text-text-primary-dark">{project.description}</p>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Technologies: {project.technologies.join(', ')}</p>
              <div className="mt-4 space-x-2 flex">
                <Button
                  onClick={() => handleEdit(project)}
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
                  onClick={() => handleDelete(project._id)}
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

export default ProjectsManager;
