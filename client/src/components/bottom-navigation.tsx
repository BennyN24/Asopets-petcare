import React, { memo } from "react";
import { useLocation } from "wouter";
import { Home, Calendar, DollarSign, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "home" | "schedule" | "expenses" | "profile";
}

export default memo(function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/" },
    { key: "schedule", icon: Calendar, label: "Schedule", path: "/schedule" },
    { key: "expenses", icon: DollarSign, label: "Expenses", path: "/expenses" },
    { key: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map(({ key, icon: Icon, label, path }) => (
          <button
            key={key}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === key ? "text-primary" : "text-gray-400"
            }`}
            onClick={() => setLocation(path)}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
