import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Boxes,
  Code2,
  UserCircle,
  Briefcase,
  GraduationCap,
  MessageSquareQuote,
  MessageSquare,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // for mobile only

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Boxes size={20} />, label: 'Projects', path: '/admin/projects' },
    { icon: <Code2 size={20} />, label: 'Tech Stack', path: '/admin/tech-stack' },
    { icon: <UserCircle size={20} />, label: 'About', path: '/admin/about' },
    { icon: <Briefcase size={20} />, label: 'Experience', path: '/admin/experience' },
    { icon: <GraduationCap size={20} />, label: 'Education', path: '/admin/education' },
    { icon: <MessageSquareQuote size={20} />, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/admin/messages' },
    { icon: <Award size={20} />, label: 'Certificates', path: '/admin/certificates' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    { icon: <Boxes size={20} />, label: 'Specializations', path: '/admin/specializations' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -256 }} // 256px = w-64
        transition={{ type: 'spring', damping: 20 }}
        className={`
          fixed md:static z-50 top-0 left-0 w-64 h-full
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:flex flex-col
        `}
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Panel
            </h2>
            {/* Theme Toggle - desktop */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 text-base rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </motion.button>
            ))}

            <motion.button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 mt-8 text-base text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </motion.button>

            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center w-full px-4 py-3 mt-2 text-base text-primary dark:text-primary rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} />
              <span className="ml-3">Return Home</span>
            </motion.button>
          </nav>
        </div>
      </motion.aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        {/* Mobile top bar */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-sm z-40">
          <button onClick={toggleTheme} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${
            theme === 'dark' ? '%23ffffff' : '%23000000'
          }' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export default AdminLayout;
