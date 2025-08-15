// components/Navbar.tsx
import React, { useState } from "react";
import { useUserData, useSignOut } from "@nhost/react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut, Plus, BotMessageSquare } from "lucide-react";

interface NavbarProps {
  onNewChat?: () => void;
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ onNewChat }: NavbarProps) {
  const user = useUserData();
  const { signOut } = useSignOut();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-gray-900 text-white border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <>
            <NavLink to="/" className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <BotMessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold">H.O.M.E.R ai</h1>
            </NavLink>
          </>

          <div className="flex items-center space-x-4">
            {onNewChat && (
              <button
                onClick={onNewChat}
                className="hidden sm:flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 z-50">
                  <div className="flex items-center p-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold truncate">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
