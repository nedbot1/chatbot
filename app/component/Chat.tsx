"use client";

import { useState, useRef } from "react";

type Message = { user: string; bot?: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{
    used: number;
    remaining: number | null;
  }>({ used: 0, remaining: null });
  const [history, setHistory] = useState<{ id: number; messages: Message[] }[]>(
    []
  );
  const chatEndRef = useRef<HTMLDivElement>(null);

  const totalCredits = 100; // replace with your plan's total credits

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { user: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { user: userMessage, bot: data.reply },
      ]);

      if (data.creditsUsed !== undefined) {
        setUsage({
          used: data.creditsUsed,
          remaining: totalCredits - data.creditsUsed,
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { user: userMessage, bot: String(error) || "Error: please try again" },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // Clear current messages but keep usage
  const clearChat = () => setMessages([]);

  // Start a new chat
  const newChat = () => {
    if (messages.length) {
      setHistory((prev) => [...prev, { id: Date.now(), messages }]);
    }
    setMessages([]);
    setUsage({ used: 0, remaining: totalCredits });
  };

  // Delete specific chat from history
  const deleteChat = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    // If current chat is from deleted history, clear it
    const deletedChat = history.find((h) => h.id === id);
    if (deletedChat && messages === deletedChat.messages) {
      setMessages([]);
    }
  };

  // Clear all chat history
  const clearHistory = () => {
    setHistory([]);
    setMessages([]);
  };

  return (
    <div className="flex flex-col md:flex-row h-[90vh] max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700">
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
              className="flex justify-between items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <button
                onClick={() => setMessages(h.messages)}
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

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col space-y-1">
              {msg.user && (
                <div className="self-end max-w-xs bg-blue-500 text-white p-3 rounded-2xl rounded-br-none shadow-md">
                  {msg.user}
                </div>
              )}
              {msg.bot && (
                <div className="self-start max-w-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-2xl rounded-bl-none shadow-md">
                  {msg.bot}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me any GK question..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-md font-medium transition-all disabled:opacity-50"
          >
            {loading ? "Loading..." : "Send"}
          </button>
          <button
            onClick={clearChat}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl shadow-md font-medium transition-all"
          >
            Clear
          </button>
        </div>

        {/* Usage info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Codebuff Usage
          </h2>
          <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-300">
            <span>Used: {usage.used}</span>
            <span>
              Remaining: {usage.remaining !== null ? usage.remaining : "N/A"}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((usage.remaining ?? 0) / totalCredits) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
