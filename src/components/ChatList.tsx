import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MessageCircle,
  Plus,
  Search,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { GET_USER_CHATS, INSERT_CHAT } from "../graphql/queries";
import { ChatView } from "./ChatView";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function ChatList() {
  const [newChatTitle, setNewChatTitle] = useState("");
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useUserData();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [insertChat, { loading: insertLoading }] = useMutation(INSERT_CHAT, {
    onCompleted: (data) => {
      setNewChatTitle("");
      setShowNewChatForm(false);
      refetch();
      navigate(`/chat/${data.insert_chats_one.id}`);
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTitle.trim() || !user?.id) return;

    await insertChat({
      variables: {
        userId: user.id,
        title: newChatTitle.trim(),
      },
    });
  };

  const filteredChats =
    data?.chats?.filter((chat: Chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
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
                  onClick={() => {
                    useSignOut().signOut();
                    navigate("/auth");
                  }}
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
      <div className="flex-1 flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 z-10 transform transition-transform duration-300 md:static md:transform-none ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6">
              <button
                onClick={() => {
                  setShowNewChatForm(true);
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Chat
              </button>
            </div>
            <div className="px-6 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading chats...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">Error loading chats</p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "No chats found"
                      : "No chats yet. Create one to start!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChats.map((chat: Chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        navigate(`/chat/${chat.id}`);
                        setIsSidebarOpen(false);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                        chatId === chat.id
                          ? "bg-blue-50 border border-blue-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(chat.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 ml-0 md:ml-4">
          {chatId ? (
            <ChatView />
          ) : (
            <div className="h-full flex items-center justify-center bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Start a New Conversation
                </h2>
                <p className="text-gray-600 mb-6">
                  Select a chat from the sidebar or create a new one to begin
                  chatting with your AI assistant.
                </p>
                <button
                  onClick={() => setShowNewChatForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Chat
            </h3>
            <form onSubmit={handleCreateChat}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chat Title
                </label>
                <input
                  type="text"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter chat title..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewChatForm(false);
                    setNewChatTitle("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={insertLoading || !newChatTitle.trim()}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {insertLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
