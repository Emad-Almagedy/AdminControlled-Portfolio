import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'About', path: '/admin/about' },
  { name: 'Projects', path: '/admin/projects' },
  { name: 'Tech Stack', path: '/admin/techstack' },
  { name: 'Experience', path: '/admin/experience' },
  { name: 'Education', path: '/admin/education' },
  { name: 'Testimonials', path: '/admin/testimonials' },
  { name: 'Certificates', path: '/admin/certificates' },
  { name: 'Messages', path: '/admin/messages' },
  { name: 'Settings', path: '/admin/settings' },
];

const SidebarNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-gray-100 dark:bg-gray-900 shadow-md p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h2>
      <ul className="flex flex-col space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
