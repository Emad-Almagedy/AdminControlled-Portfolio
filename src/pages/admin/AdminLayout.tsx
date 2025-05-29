import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNavigation from '../../components/admin/ui/SidebarNavigation';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark">
      <SidebarNavigation />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
