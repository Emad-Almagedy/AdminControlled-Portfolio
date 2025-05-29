import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Mobile Sidebar Toggle Button - moved to right */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Flex container wrapping sidebar and main content */}
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 z-40 w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
            transform transition-transform duration-500 ease-in-out md:block ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
        >
          <div className="h-full px-4 py-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} color="white" /> : <Moon size={20} />}
              </button>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center w-full px-4 py-3 text-base rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 mt-8 text-base text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="flex items-center w-full px-4 py-3 mt-2 text-base text-primary dark:text-primary rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
              >
                <Home size={20} />
                <span className="ml-3">Return Home</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 min-h-screen">
          <Outlet />
        </main>

      </div>

      {/* Background Pattern */}
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
