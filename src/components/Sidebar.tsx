import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Receipt, 
  Settings, 
  Users, 
  TrendingUp,
  FileText,
  LogOut,
  Leaf,
  X,
  Mail // New
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, isOpen, setIsOpen }) => {
  const location = useLocation();

  const userMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: TrendingUp, label: 'Investments', path: '/admin/investments' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Mail, label: 'Email', path: '/admin/email' }, // New
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              GrowWithUs
            </h1>
            <p className="text-xs text-gray-500 font-medium">COMPANY</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/admin' || location.pathname === '/admin');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600'
                  : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
        <div 
          className={`relative w-64 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'transform-none' : '-translate-x-full'}`}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow-sm border-r border-gray-200">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
