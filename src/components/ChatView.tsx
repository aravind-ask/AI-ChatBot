import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle, User, Clock, Bot } from "lucide-react";
import {
  GET_CHAT_BY_ID,
  SUBSCRIBE_TO_MESSAGES,
  INSERT_MESSAGE,
  SEND_MESSAGE_TO_BOT,
} from "../graphql/queries";

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

  // Fetch chat details
  const {
    data: chatData,
    loading: chatLoading,
    error: chatError,
  } = useQuery(GET_CHAT_BY_ID, {
    variables: { chatId },
    skip: !chatId,
  });

  // Subscribe to messages
  const {
    data: messagesData,
    loading: messagesLoading,
    error: subscriptionError,
  } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
  });

  // Insert message mutation
  const [insertMessage, { loading: sendingMessage, error: insertError }] =
    useMutation(INSERT_MESSAGE, {
      onError: (error) => {
        console.error("Error sending message:", error);
      },
    });

  // Send message to bot mutation
  const [sendMessageToBot, { loading: sendingToBot, error: botError }] =
    useMutation(SEND_MESSAGE_TO_BOT, {
      onError: (error) => {
        console.error("Error sending message to bot:", error);
      },
    });

  const messages: Message[] = messagesData?.messages || [];
  const chat: Chat | null = chatData?.chats_by_pk || null;

  // Debug subscription
  useEffect(() => {
    console.log("Subscription data:", messagesData);
    console.log("Subscription error:", subscriptionError);
    console.log("Messages:", messages);
  }, [messagesData, subscriptionError]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !chatId) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsTyping(true);

    try {
      // Insert user message
      await insertMessage({
        variables: {
          chatId,
          userId: user.id,
          content: messageContent,
          isBot: false,
        },
      });

      // Send message to bot
      await sendMessageToBot({
        variables: {
          chatId,
          content: messageContent,
        },
      });
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups: { [key: string]: Message[] }, message) => {
      const date = formatDate(message.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {}
  );

  if (chatLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (chatError || subscriptionError || !chat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-4">
            {subscriptionError ? "Connection error" : "Chat not found"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {subscriptionError?.message || chatError?.message}
          </p>
          <button
            onClick={() => navigate("/chats")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/chats")}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {chat.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {messages.length}{" "}
                  {messages.length === 1 ? "message" : "messages"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 h-full flex flex-col">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No messages yet
                  </h3>
                  <p className="text-gray-600">
                    Start the conversation by sending your first message!
                  </p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                          {date}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {dateMessages.map((message) => {
                        const isOwnMessage =
                          message.user_id === user?.id && !message.is_bot;
                        const isBotMessage = message.is_bot;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md ${
                                isOwnMessage ? "order-2" : "order-1"
                              }`}
                            >
                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  isOwnMessage
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                    : isBotMessage
                                    ? "bg-gradient-to-r from-green-500 to-teal-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                {isBotMessage && (
                                  <div className="flex items-center mb-1">
                                    <Bot className="w-3 h-3 mr-1" />
                                    <span className="text-xs font-medium">
                                      AI Assistant
                                    </span>
                                  </div>
                                )}
                                {!isOwnMessage && !isBotMessage && (
                                  <div className="flex items-center mb-1">
                                    <User className="w-3 h-3 mr-1" />
                                    <span className="text-xs font-medium">
                                      Other User
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm leading-relaxed">
                                  {message.content}
                                </p>
                                <div
                                  className={`flex items-center mt-1 ${
                                    isOwnMessage
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <Clock className="w-3 h-3 mr-1 opacity-70" />
                                  <span className="text-xs opacity-70">
                                    {formatTime(message.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-end space-x-3"
              >
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
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
                    !newMessage.trim() ||
                    sendingMessage ||
                    sendingToBot ||
                    isTyping
                  }
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {sendingMessage || sendingToBot || isTyping ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              {(sendingMessage || sendingToBot) && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {sendingMessage
                    ? "Sending message..."
                    : "Getting AI response..."}
                </div>
              )}
              {(insertError || botError) && (
                <div className="mt-2 text-xs text-red-500 text-center">
                  {insertError?.message ||
                    botError?.message ||
                    "Error sending message"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
