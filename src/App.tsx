import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Portfolio pages
import Portfolio from './pages/portfolio/Portfolio';

// Auth pages
import Login from './pages/auth/Login';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProjectsManager from './pages/admin/ProjectsManager';
import TechStackManager from './pages/admin/TechStackManager';
import AboutManager from './pages/admin/AboutManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import EducationManager from './pages/admin/EducationManager';
import CertificatesManager from './pages/admin/CertificatesManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsManager from './pages/admin/SettingsManager';
import SpecializationManager from './pages/admin/SpecializationManager';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Routes>
              {/* Portfolio Routes */}
              <Route path="/" element={<Portfolio />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="tech-stack" element={<TechStackManager />} />
                <Route path="about" element={<AboutManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="education" element={<EducationManager />} />
                <Route path="certificates" element={<CertificatesManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="settings" element={<SettingsManager />} />
                <Route path="specializations" element={<SpecializationManager />} />
              </Route>
            </Routes>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;