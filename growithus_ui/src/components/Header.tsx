import React from 'react';
import { Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, pageTitle }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-900 hidden md:block">{pageTitle}</h1>

      <div className="flex items-center gap-4 ml-auto">
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default Header;
