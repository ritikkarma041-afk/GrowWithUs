import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  TrendingUp, 
  FileText, 
  Mail, 
  Settings, 
  ChevronDown,
  ChevronRight,
  LogOut,
  FolderOpen,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [usersExpanded, setUsersExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      path: '/admin',
      exact: true
    },
    { 
      name: 'Users', 
      icon: Users, 
      path: '/admin/users',
      hasSubmenu: true,
      submenuItems: [
        { name: 'All Users', path: '/admin/users' },
        { name: 'Add User', path: '/admin/users/add' }
      ]
    },
    { 
      name: 'Investments', 
      icon: TrendingUp, 
      path: '/admin/investments' 
    },
    { 
      name: 'Reports', 
      icon: FileText, 
      path: '/admin/reports' 
    },
    { 
      name: 'Email', 
      icon: Mail, 
      path: '/admin/email' 
    },
    { 
      name: 'File Manager', 
      icon: FolderOpen, 
      path: '/admin/file-manager' 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/admin/settings' 
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GW</span>
            </div>
            <span className="font-bold text-gray-900">GrowWithUs</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.hasSubmenu ? (
                <>
                  <button
                    onClick={() => setUsersExpanded(!usersExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {usersExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {usersExpanded && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.submenuItems?.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500'
                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`
                  }
                  end={item.exact}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
