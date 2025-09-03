import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const getPageTitle = (pathname: string): string => {
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length < 2) return 'Admin Dashboard';
  
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  if (!isNaN(Number(lastSegment))) {
    return 'User Details';
  }

  switch (lastSegment) {
    case 'admin': return 'Dashboard';
    case 'users': return 'Users Management';
    case 'add': return 'Add New User';
    case 'investments': return 'Investments';
    case 'reports': return 'Reports';
    case 'email': return 'Email';
    case 'settings': return 'Settings';
    case 'file-manager': return 'File Manager';
    default:
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  }
};

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col md:ml-64">
        <Header setSidebarOpen={setSidebarOpen} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
