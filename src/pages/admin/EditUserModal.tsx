import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface EditUserModalProps {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: { username: string; email: string; role: string; password?: string }) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setPassword('');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: { username: string; email: string; role: string; password?: string } = { username, email, role };
    if (password.trim() !== '') {
      updatedUser.password = password;
    }
    onSave(updatedUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Username</label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300 ease-in-out"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-text-primary dark:text-text-primary-dark">Password (leave blank to keep unchanged)</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=""
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="secondary">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
