import React, { useState, useRef } from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import useClickOutside from '../hooks/useClickOutside';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const notifications = [
    { id: 1, type: 'success', message: 'User #1234 just signed up.', time: '5m ago' },
    { id: 2, type: 'error', message: 'Database connection failed.', time: '1h ago' },
    { id: 3, type: 'success', message: 'New investment of $5,000 processed.', time: '3h ago' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
        <Bell className="h-6 w-6" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <a
                key={notification.id}
                href="#"
                className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex-shrink-0 mr-3">
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200">
            <a href="#" className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-500">
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
