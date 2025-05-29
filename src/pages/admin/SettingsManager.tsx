import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import FormLayout from '../../components/admin/ui/FormLayout';
import { Button } from '../../components/ui/Button';
import ActionButtons from '../../components/admin/ui/ActionButtons';
import EditUserModal from './EditUserModal';

interface Settings {
  footerText?: string;
  [key: string]: any;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const SettingsManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState<Settings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);

  const openEditModal = (user: User) => {
    setEditUserData(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUserData(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEditUser = (updatedUser: { username: string; email: string; role: string; password?: string }) => {
    if (!editUserData) return;
    handleEditUser(editUserData._id, updatedUser);
    closeEditModal();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, navigate]);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        fetchUsers();
        alert('User added successfully.');
      } else {
        const errorData = await res.json();
        alert(`Failed to add user: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user.');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleEditUser = async (id: string, updatedUser: { username: string; email: string; role: string; password?: string }) => {
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      if (res.ok) {
        fetchUsers();
        alert('User updated successfully.');
      } else {
        alert('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user.');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchUsers();
        alert('User deleted successfully.');
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user.');
    } finally {
      setIsUsersLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">Manage Settings</h1>
      </div>

      <section className="max-w-4xl mx-auto w-full">
        {isUsersLoading ? (
          <p className="text-center text-text-secondary dark:text-text-secondary-dark">Loading users...</p>
        ) : (
          <>
            <ul className="space-y-4 mb-8">
              {users.map((user) => (
                <li
                  key={user._id ?? user.email}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm dark:shadow-none bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg"
                >
                  <div>
                    <p className="font-semibold text-text-primary dark:text-text-primary-dark">{user.username}</p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{user.email}</p>
                  </div>
                  <ActionButtons
                    onEdit={() => openEditModal(user)}
                    onDelete={() => handleDeleteUser(user._id)}
                  />
                </li>
              ))}
            </ul>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
              <FormLayout
                title="Add New User"
                onSubmit={handleAddUser}
                isLoading={isUsersLoading}
                submitLabel="Add User"
              >
                <div>
                  <label htmlFor="username" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Username</label>
                  <Input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </FormLayout>
            </div>
          </>
        )}
      </section>

      {isEditModalOpen && editUserData && (
        <EditUserModal
          user={editUserData}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveEditUser}
        />
      )}
    </div>
  );
};

export default SettingsManager;
