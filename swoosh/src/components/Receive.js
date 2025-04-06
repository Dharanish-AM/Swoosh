import React, { useRef, useState, useEffect } from "react";
import "../styles/Receive.css";
import { useRouter } from "next/navigation";
import { FaWifi } from "react-icons/fa";

export default function Receive() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [ws, setWs] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const router = useRouter();

  // Establish WebSocket connection on mount
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Received:", message);

      if (message.type === "session-joined") {
        setReceiverId(message.data.receiverId);
      }
    };
    socket.onerror = (error) => console.error("❌ WebSocket error:", error);
    socket.onclose = () => console.log("❌ WebSocket disconnected");

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // Auto-submit when all 5 digits are filled
  useEffect(() => {
    if (code.join("").length === 5) {
      handleSubmit(code.join(""));
    }
  }, [code]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (sessionCode) => {
    if (!sessionCode) {
      console.error("❌ Session code is required.");
      return;
    }
    if (ws && ws.readyState !== WebSocket.OPEN) {
      console.error("❌ WebSocket is not connected.");
      return;
    }

    // Send the join request
    ws.send(
      JSON.stringify({
        type: "join-session",
        data: {
          code: sessionCode,
          ip: "192.168.1.10", // You can replace this with dynamic IP if needed
          name: "My Device",
        },
      })
    );
  };

  return (
    <div className="receive-container">
      <div className="connection-container">
        <div className="scanning-design"></div>
        <div className="scanning-circle">
          <FaWifi color="var(--text-color)" size={"1.7rem"} />
          Waiting
        </div>
      </div>
      <div className="connection-code-container">
        <span className="connection-code-text">
          Enter code below to connect and receive files.
        </span>
        <div className="parent-receive-code-container">
          <div className="code-inputs-boxes">
            {code.map((digit, index) => (
              <div key={index} className="code-input-box">
                <input
                  type="text"
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="code-input"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="actions-buttons">
        <button onClick={() => router.push("/send")} className="send-button">
          Send
        </button>
        <button
          onClick={() => router.push("/receive")}
          className="receive-button active"
        >
          Receive
        </button>
      </div>
    </div>
  );
}