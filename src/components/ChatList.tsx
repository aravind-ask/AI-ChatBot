// ChatList.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { GET_USER_CHATS, INSERT_CHAT } from "../graphql/queries";
import { ChatView } from "./ChatView";
import { Navbar } from "./Navbar";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = useUserData();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar
        onNewChat={() => setShowNewChatForm(true)}
        showSidebarToggle={true}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-full sm:w-80 bg-[#151B23] border-r border-gray-700 flex flex-col transition-all duration-300 fixed z-30
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
            top-16 left-0 h-[calc(100vh-4rem)]`}
        >
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading chats...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">Error loading chats</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-400">
                  {searchTerm ? "No chats found" : "No chats yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-1 px-2">
                {filteredChats.map((chat: Chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      navigate(`/chat/${chat.id}`);
                      if (window.innerWidth < 640) setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chatId === chat.id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {formatDate(chat.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? 'hidden sm:flex' : 'flex'} md:ml-80`}>
          {chatId ? (
            <ChatView />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-800/50 p-4 sm:p-8">
              <div className="text-center max-w-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  Start a New Conversation
                </h2>
                <p className="text-sm sm:text-base text-gray-400 mb-6 px-4">
                  Select a chat from the sidebar or create a new one to begin
                  chatting with your AI assistant.
                </p>
                <button
                  onClick={() => setShowNewChatForm(true)}
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Create New Chat</h3>
            <form onSubmit={handleCreateChat}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chat Title
                </label>
                <input
                  type="text"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter chat title..."
                  className="w-full px-4 py-3 text-sm bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={insertLoading || !newChatTitle.trim()}
                  className="flex items-center px-4 sm:px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
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
