"use client";

import { useState, useRef, useEffect } from "react";
import { getApiUrl } from "../config/api";
import { Capacitor, CapacitorHttp } from "@capacitor/core";

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
      const isCapacitor = Capacitor.isNativePlatform();
      let data;
      if (isCapacitor) {
        const response = await CapacitorHttp.post({
          url: getApiUrl("/api/chat"),
          headers: { "Content-Type": "application/json" },
          data: { message: userMessage },
        });
        data = response.data;
      } else {
        const res = await fetch(getApiUrl("/api/chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });
        data = await res.json();
      }

      setMessages((prev) => [
        ...prev,
        { user: "", bot: data?.reply || "No response received" },
      ]);
      if (data?.creditsUsed !== undefined) {
        const newUsed = usage.used + (data.creditsUsed || 0);
        setUsage({ used: newUsed, remaining: totalCredits - newUsed });
      }
    } catch (error) {
      console.error("Request error:", error);
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
    if (messages.length)
      setHistory((prev) => [...prev, { id: Date.now(), messages }]);
    setMessages([]);
    setUsage({ used: 0, remaining: totalCredits });
  };
  const deleteChat = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    const deletedChat = history.find((h) => h.id === id);
    if (deletedChat && messages === deletedChat.messages) setMessages([]);
  };
  const clearHistory = () => {
    setHistory([]);
    setMessages([]);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen w-screen bg-white dark:bg-gray-950">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300
            w-3/4 md:w-72 bg-gray-50 dark:bg-gray-900 p-5 flex flex-col border-r border-gray-200 dark:border-gray-800`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-gray-700 dark:text-gray-100">
              Chats
            </h2>
            <button
              onClick={clearHistory}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          <button
            onClick={newChat}
            className="mb-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md"
          >
            + New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className={`flex justify-between items-center rounded-xl transition-colors ${
                  messages === h.messages
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <button
                  onClick={() => {
                    setMessages(h.messages);
                    setSidebarOpen(false);
                  }}
                  className="flex-1 text-left px-3 py-2 truncate text-gray-700 dark:text-gray-200 font-medium"
                >
                  Chat {new Date(h.id).toLocaleTimeString()}
                </button>
                <button
                  onClick={() => deleteChat(h.id)}
                  className="text-red-500 hover:text-red-700 px-2 text-lg font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat area */}
        <section className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-950">
          <header className="p-5 h-[20vh] border-b border-gray-200 dark:border-gray-800 flex justify-between items-end bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-700 dark:text-gray-200 text-2xl"
              >
                ☰
              </button>
              <h2 className="font-bold text-xl text-gray-700 dark:text-gray-100">
                Chatbot
              </h2>
            </div>
          </header>

          <main className="flex-1 justify-center items-center p-5 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                <h3 className="text-2xl font-semibold mb-2">
                  Welcome to your Chatbot
                </h3>
                <p>Ask me anything related to coding…</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col space-y-1">
                {msg.user && (
                  <div className="flex justify-end">
                    <div className="max-w-md bg-blue-500 text-white px-4 py-3 rounded-2xl rounded-br-none shadow">
                      {msg.user}
                    </div>
                  </div>
                )}
                {msg.bot && (
                  <div className="flex justify-start">
                    <div className="max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow">
                      {msg.bot}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </main>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex space-x-3 shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl shadow font-medium disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
            <button
              onClick={clearChat}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl shadow font-medium"
            >
              Clear
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
