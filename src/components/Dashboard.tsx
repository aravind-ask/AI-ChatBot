// Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { BotMessageSquare, MessageCircle } from "lucide-react";
import { Navbar } from "./Navbar";

export function Dashboard() {
  const navigate = useNavigate();

  const handleStartChatting = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar onNewChat={handleStartChatting} />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <BotMessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 px-4">
            Welcome to H.O.M.E.R ai
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-lg mx-auto px-4">
            Ask anything, from solving problems to sparking creativity. Your AI
            companion is ready to assist you 24/7.
          </p>
          <button
            onClick={handleStartChatting}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Start Chatting Now
          </button>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                Ask Questions
              </h3>
              <p className="text-sm text-gray-400">
                Get instant answers to your questions, from simple facts to
                complex explanations.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-purple-500 transition-all hover:-translate-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                Spark Ideas
              </h3>
              <p className="text-sm text-gray-400">
                Brainstorm creative ideas, solve problems, or explore new topics
                with your AI.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-teal-500 transition-all hover:-translate-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                Learn Faster
              </h3>
              <p className="text-sm text-gray-400">
                Understand complex concepts with simplified explanations and
                examples.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
