import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { useClickOutside } from "../hooks/useClickOutside";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const { token, user } = auth;
  const userName = user?.name ? user.name.split("@")[0] : user?.name || "Guest";

  const displayName = userName?.charAt(0)?.toUpperCase() + userName?.slice(1);

  const role = user?.role || "User";

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  useClickOutside(notificationsRef, () => setIsNotificationsOpen(false));

  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="text-gray-500 focus:outline-none lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative text-gray-500 hover:text-gray-700"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </button>
            {isNotificationsOpen && <NotificationDropdown />}
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userName?.charAt(0)?.toUpperCase() ?? ""}
            </div>
            <div className="hidden sm:block">
              <div className="font-medium text-gray-800 text-sm">
                {displayName ?? ""}
              </div>
              <div className="text-xs text-gray-500">{role ?? "User"}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
