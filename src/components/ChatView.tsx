// ChatView.tsx
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Clock } from "lucide-react";
import {
  GET_CHAT_BY_ID,
  SUBSCRIBE_TO_MESSAGES,
  INSERT_MESSAGE,
  SEND_MESSAGE_TO_BOT,
} from "../graphql/queries";
import { Navbar } from "./Navbar";

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_bot: boolean;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

export function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUserData();
  const navigate = useNavigate();

  const {
    data: chatData,
    loading: chatLoading,
    error: chatError,
  } = useQuery(GET_CHAT_BY_ID, {
    variables: { chatId },
    skip: !chatId,
  });

  const {
    data: messagesData,
    loading: messagesLoading,
    error: subscriptionError,
  } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
  });

  const [insertMessage, { loading: sendingMessage }] =
    useMutation(INSERT_MESSAGE);
  const [sendMessageToBot, { loading: sendingToBot }] =
    useMutation(SEND_MESSAGE_TO_BOT);

  const messages: Message[] = messagesData?.messages || [];
  const chat: Chat | null = chatData?.chats_by_pk || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !chatId) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsTyping(true);

    try {
      await insertMessage({
        variables: {
          chatId,
          userId: user.id,
          content: messageContent,
          isBot: false,
        },
      });

      await sendMessageToBot({
        variables: {
          chatId,
          content: messageContent,
        },
      });
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (chatLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (chatError || subscriptionError || !chat) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Bot className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-400 mb-4">
            {subscriptionError ? "Connection error" : "Chat not found"}
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-400">
                  Send your first message to start the conversation
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const isUser = message.user_id === user?.id && !message.is_bot;
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl p-4 bg-[#1F2937]`}
                    >
                      {message.is_bot && (
                        <div className="flex items-center mb-2">
                          <Bot className="w-4 h-4 mr-2 text-teal-400" />
                          <span className="text-xs font-medium text-gray-300">
                            AI Assistant
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-xl p-4 max-w-xs">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-3 bg-gray-800 rounded-xl p-3"
          >
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message AI Assistant..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "120px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={
                !newMessage.trim() || sendingMessage || sendingToBot || isTyping
              }
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {sendingMessage || sendingToBot || isTyping ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-2">
            AI Assistant may produce inaccurate information
          </p>
        </div>
      </div>
    </div>
  );
}
