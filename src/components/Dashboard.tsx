import React, { useState } from "react";
import { useUserData, useSignOut } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X, MessageCircle } from "lucide-react";

export function Dashboard() {
  const user = useUserData();
  const { signOut } = useSignOut();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  const handleStartChatting = () => {
    console.log("Start Chatting Now clicked, navigating to /chat");
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Chatbot</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.displayName || "User"}
              </span>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 z-10">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your AI Assistant! 🚀
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ask anything, from solving problems to sparking creativity. Your AI
            is ready to assist, inform, and maybe even entertain!
          </p>
          <button
            onClick={handleStartChatting}
            className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Start Chatting Now
          </button>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ask Questions
              </h3>
              <p className="text-sm text-gray-600">
                Get instant answers to your questions, from simple facts to
                complex explanations.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Spark Ideas
              </h3>
              <p className="text-sm text-gray-600">
                Brainstorm creative ideas, solve problems, or explore new topics
                with your AI.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
