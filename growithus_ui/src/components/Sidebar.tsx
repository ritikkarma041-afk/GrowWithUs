import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, TrendingUp, FileText, Mail, Settings, LogOut, ChevronDown, X, FolderOpen } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [usersSubMenuOpen, setUsersSubMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/admin/users')) {
      setUsersSubMenuOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { 
      href: '/admin/users', 
      icon: Users, 
      label: 'Users',
      submenu: [
        { href: '/admin/users', label: 'All Users' },
        { href: '/admin/users/add', label: 'Add User' },
      ]
    },
    { href: '/admin/investments', icon: TrendingUp, label: 'Investments' },
    { href: '/admin/reports', icon: FileText, label: 'Reports' },
    { href: '/admin/email', icon: Mail, label: 'Email' },
    { href: '/admin/file-manager', icon: FolderOpen, label: 'File Manager' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log('Logging out...');
    // e.g., clear token, redirect
  };

  const renderNavLink = (item: any, isSubmenu = false) => (
    <NavLink
      to={item.href}
      end={item.href === '/admin' || item.href === '/admin/users'}
      className={({ isActive }) =>
        `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isSubmenu ? 'pl-11' : ''
        } ${
          isActive
            ? 'bg-emerald-100 text-emerald-700'
            : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
        }`
      }
      onClick={() => setSidebarOpen(false)}
    >
      {item.icon && <item.icon className={`mr-3 h-5 w-5 ${isSubmenu ? 'hidden' : ''}`} />}
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-4 h-16">
          <span className="text-xl font-bold text-emerald-600">GrowWithUs</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) =>
              item.submenu ? (
                <div key={item.label}>
                  <button
                    onClick={() => setUsersSubMenuOpen(!usersSubMenuOpen)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-emerald-50 hover:text-emerald-700`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 transform transition-transform ${usersSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {usersSubMenuOpen && (
                    <div className="mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <div key={subItem.label}>{renderNavLink(subItem, true)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div key={item.label}>{renderNavLink(item)}</div>
              )
            )}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
