
import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================================================
  // BACKEND API URL
  // ======================================================

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Keep previous conversation history
    // BEFORE adding the new user message.
    const currentHistory = chat.map((item) => ({
      sender: item.sender,
      text: item.text,
    }));

    // Add user message immediately to UI
    setChat((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: currentHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const aiReply =
        data.reply ||
        data.message ||
        data.response ||
        "Sorry, I couldn't generate a response.";

      // Add AI response
      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "❌ Unable to connect to Money Mentor AI. Please check that the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CLEAR CHAT
  // ======================================================

  const clearChat = () => {
    setChat([]);
  };

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* ==================================================
            NAVBAR
        ================================================== */}

        <Navbar />

        {/* ==================================================
            CHAT AREA
        ================================================== */}

        <main className="flex-1 min-h-0 px-5 py-6 md:px-8 lg:px-10">
          <div className="h-[calc(100vh-130px)] max-w-[1400px] mx-auto">
            {/* ==================================================
                CHAT HEADER / CONTROLS
            ================================================== */}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-500/10
                    border
                    border-green-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <span className="text-lg">🤖</span>
                </div>

                <div>
                  <h1 className="text-base md:text-lg font-semibold">
                    Money Mentor AI
                  </h1>

                  <p className="text-xs text-slate-500">
                    Personal finance assistant
                  </p>
                </div>
              </div>

              {/* ==================================================
                  CLEAR CHAT
              ================================================== */}

              {chat.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-400
                    text-sm
                    font-medium
                    hover:bg-red-500/20
                    hover:text-red-300
                    transition-all
                    duration-200
                  "
                >
                  🗑️

                  <span className="hidden sm:inline ml-2">
                    Clear Chat
                  </span>
                </button>
              )}
            </div>

            {/* ==================================================
                CHAT BOX
            ================================================== */}

            <div
              className="
                h-[calc(100%-60px)]
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                overflow-hidden
                shadow-xl
                shadow-black/10
              "
            >
              <ChatBox
                chat={chat}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                loading={loading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;

