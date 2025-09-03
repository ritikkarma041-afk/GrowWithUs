import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useClickOutside } from '../hooks/useClickOutside';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notificationRef = useClickOutside(() => {
    setIsNotificationOpen(false);
  });

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {isNotificationOpen && <NotificationDropdown />}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
