"use client";

import { useState, useRef, useEffect } from "react";
import { getApiUrl } from "../config/api";
import { Capacitor, CapacitorHttp } from '@capacitor/core';


type Message = { user: string; bot?: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{
    used: number;
    remaining: number | null;
  }>({ used: 0, remaining: 100 });
  const [history, setHistory] = useState<{ id: number; messages: Message[] }[]>(
    []
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const totalCredits = 100;

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { user: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Check if we're in a Capacitor environment using the official method
      const isCapacitor = Capacitor.isNativePlatform();

      console.log('Capacitor platform:', Capacitor.getPlatform());
      console.log('Is native platform:', isCapacitor);

      let data;
      if (isCapacitor) {
        // Use CapacitorHttp directly for native platforms to bypass CORS
        console.log('Using CapacitorHttp (native)');
        const response = await CapacitorHttp.post({
          url: getApiUrl('/api/chat'),
          headers: { "Content-Type": "application/json" },
          data: { message: userMessage },
        });
        data = response.data;
      } else {
        // Use regular fetch for web
        console.log('Using regular fetch (web)');
        const res = await fetch(getApiUrl('/api/chat'), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });
        data = await res.json();
      }

      setMessages((prev) => [...prev, { user: "", bot: data?.reply || "No response received" }]);

      // accumulate usage
      if (data?.creditsUsed !== undefined) {
        const newUsed = usage.used + (data.creditsUsed || 0);
        setUsage({ used: newUsed, remaining: totalCredits - newUsed });
      }
    } catch (error) {
      console.error('Request error:', error);
      setMessages((prev) => [
        ...prev,
        { user: "", bot: String(error) || "Error: please try again" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  const newChat = () => {
    if (messages.length) {
      setHistory((prev) => [...prev, { id: Date.now(), messages }]);
    }
    setMessages([]);
    setUsage({ used: 0, remaining: totalCredits });
  };

  const deleteChat = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    const deletedChat = history.find((h) => h.id === id);
    if (deletedChat && messages === deletedChat.messages) {
      setMessages([]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setMessages([]);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen w-screen bg-white dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300
            w-3/4 md:w-1/4 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
              Chats
            </h2>
            <button
              onClick={clearHistory}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          <button
            onClick={newChat}
            className="mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold shadow-sm transition-all"
          >
            + New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className={`flex justify-between items-center rounded-lg transition-colors ${
                  messages === h.messages
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <button
                  onClick={() => {
                    setMessages(h.messages);
                    setSidebarOpen(false);
                  }}
                  className="flex-1 text-left px-3 py-2 rounded-lg truncate text-gray-700 dark:text-gray-200 font-medium"
                >
                  Chat {new Date(h.id).toLocaleTimeString()}
                </button>
                <button
                  onClick={() => deleteChat(h.id)}
                  className="text-red-500 hover:text-red-700 px-2 text-lg font-bold transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-700 dark:text-gray-200 text-2xl"
              >
                ☰
              </button>
              <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                Chatbot
              </h2>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to your Chatbot
                </h3>
                <p>Ask me anything related coding…</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col space-y-1">
                {msg.user && (
                  <div className="flex justify-end items-start gap-2">
                    <div className="max-w-xs bg-blue-500 text-white p-3 rounded-2xl rounded-br-none shadow-md">
                      {msg.user}
                    </div>
                  </div>
                )}
                {msg.bot && (
                  <div className="flex justify-start items-start gap-2">
                    <div className="max-w-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-2xl rounded-bl-none shadow-md">
                      {msg.bot}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="max-w-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 transition"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-md font-medium transition-all disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
            <button
              onClick={clearChat}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl shadow-md font-medium transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
