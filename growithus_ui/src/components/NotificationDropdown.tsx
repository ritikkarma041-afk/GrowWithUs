import React from 'react';
import { faker } from '@faker-js/faker';
import { UserPlus, TrendingDown, AlertTriangle, Settings } from 'lucide-react';

const notifications = [
  {
    id: 1,
    icon: UserPlus,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    text: `New user signup: ${faker.internet.email()}`,
    time: '15 minutes ago',
  },
  {
    id: 2,
    icon: TrendingDown,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    text: `Large withdrawal initiated: ₹${faker.number.int({ min: 5, max: 20 }).toLocaleString('en-IN')} Lakhs`,
    time: '1 hour ago',
  },
  {
    id: 3,
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    text: 'System maintenance scheduled for 2 AM tonight.',
    time: '4 hours ago',
  },
  {
    id: 4,
    icon: Settings,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    text: 'Your API key is about to expire.',
    time: '1 day ago',
  },
];

const NotificationDropdown: React.FC = () => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div key={notification.id} className="flex items-start p-4 hover:bg-emerald-50/50 transition-colors cursor-pointer">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.bgColor}`}>
              <notification.icon className={`w-5 h-5 ${notification.color}`} />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-700">{notification.text}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 bg-gray-50 text-center">
        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
