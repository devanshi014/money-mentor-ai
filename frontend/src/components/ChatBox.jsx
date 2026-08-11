import React, { useEffect, useRef } from "react";

function ChatBox({
  chat = [],
  message,
  setMessage,
  sendMessage,
  loading,
}) {
  const bottomRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat, loading]);

  return (
    <div
      className="flex flex-col"
      style={{
        height: "calc(100vh - 70px)",
        background: "#020617",
        color: "white",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* ================================
          HEADER
      ================================= */}

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          💰 Money Mentor AI
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "6px",
            marginBottom: 0,
          }}
        >
          Your personal AI finance assistant
        </p>
      </div>

      {/* ================================
          CHAT AREA
      ================================= */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          border: "1px solid #334155",
          borderRadius: "16px",
          padding: "20px",
          background: "#0f172a",
          boxSizing: "border-box",
        }}
      >
        {/* Empty Chat */}

        {chat.length === 0 && (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "15px",
                }}
              >
                🤖
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "10px",
                }}
              >
                Welcome to Money Mentor AI
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  maxWidth: "600px",
                  lineHeight: "1.6",
                }}
              >
                Ask me anything about budgeting, investing, stocks,
                mutual funds, SIPs, taxes, savings, IPOs or personal
                finance.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}

        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                maxWidth: "80%",
              }}
            >
              {/* AI Icon */}

              {msg.sender !== "user" && (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    minWidth: "36px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  🤖
                </div>
              )}

              {/* Message */}

              <div
                style={{
                  padding: "13px 17px",
                  borderRadius: "14px",
                  background:
                    msg.sender === "user"
                      ? "#2563eb"
                      : "#1e293b",
                  border:
                    msg.sender === "user"
                      ? "none"
                      : "1px solid #334155",
                  color: "white",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking */}

        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🤖
            </div>

            <div
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                padding: "12px 16px",
                borderRadius: "14px",
                color: "#94a3b8",
              }}
            >
              🤖 Thinking...
            </div>
          </div>
        )}

        {/* Scroll Target */}

        <div ref={bottomRef} />
      </div>

      {/* ================================
          INPUT AREA
      ================================= */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Ask Money Mentor anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={loading}
          style={{
            flex: 1,
            padding: "15px 18px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            outline: "none",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          style={{
            padding: "14px 25px",
            borderRadius: "12px",
            border: "none",
            background:
              loading || !message.trim()
                ? "#475569"
                : "#16a34a",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor:
              loading || !message.trim()
                ? "not-allowed"
                : "pointer",
            minWidth: "100px",
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;