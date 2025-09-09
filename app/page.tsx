import Chat from "./component/Chat";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">GK Chatbot</h1>
      <Chat />
    </main>
  );
}
// "use client";

// import { useState } from "react";

// export default function Page() {
//   const [message, setMessage] = useState("");
//   const [reply, setReply] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!message.trim()) return;
//     setLoading(true);
//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });
//     const data = await res.json();
//     console.log(data);
//     setReply(data.reply);
//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-4">GK Chatbot</h1>
//       <textarea
//         className="w-full p-2 border rounded mb-2"
//         rows={3}
//         placeholder="Ask me anything..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button
//         onClick={sendMessage}
//         disabled={loading}
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         {loading ? "Thinking..." : "Ask"}
//       </button>

//       {reply && (
//         <div className="mt-4 p-3 border rounded bg-gray-50">
//           <strong>Bot:</strong> {reply}
//         </div>
//       )}
//     </div>
//   );
// }
