"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/Send.css";
import { useRouter } from "next/navigation";
import { TbReload } from "react-icons/tb";

export default function Send() {
  const [qrValue, setQrValue] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [isSend, setIsSend] = useState(true);
  const peerConnection = useRef(null);
  const dataChannel = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize peer-to-peer connection
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // STUN server to get public IP
      ],
    };
    peerConnection.current = new RTCPeerConnection(configuration);

    // Create data channel for file sharing
    dataChannel.current =
      peerConnection.current.createDataChannel("fileTransfer");

    // Handle ICE Candidate event
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
      }
    };

    // Handle incoming data messages from peer
    dataChannel.current.onmessage = (event) => {
      console.log("Received data:", event.data);
    };

    // Set up signaling (to simulate signaling server here)
    const signalingChannel = new WebSocket("ws://localhost:8080");

    signalingChannel.onopen = () => {
      console.log("✅ WebSocket Connected");

      const existingSessionId = localStorage.getItem("sessionId");
      if (existingSessionId) {
        signalingChannel.send(
          JSON.stringify({
            type: "check-session",
            data: { sessionId: existingSessionId },
          })
        );
      } else {
        signalingChannel.send(
          JSON.stringify({
            type: "create-session",
            data: {
              name: "My Device",
              ip: "192.168.1.10",
            },
          })
        );
      }
    };

    signalingChannel.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.type === "session-exists") {
        console.log("🔹 Existing session reused");
        setQrValue(response.data.link);
        setCode(response.data.code.split(""));
      }

      if (response.type === "session-not-found") {
        console.log("⚠️ Session not found, creating a new one...");
        localStorage.removeItem("sessionId");

        signalingChannel.send(
          JSON.stringify({
            type: "create-session",
            data: {
              name: "My Device",
              ip: "192.168.1.10",
            },
          })
        );
      }

      if (response.type === "session-created") {
        localStorage.setItem("sessionId", response.data.sessionId);
        setQrValue(response.data.link);
        setCode(response.data.code.split(""));
      }

      if (response.type === "offer") {
        // If offer received, create an answer
        const offer = new RTCSessionDescription(response.data);
        peerConnection.current
          .setRemoteDescription(offer)
          .then(() => peerConnection.current.createAnswer())
          .then((answer) => {
            peerConnection.current.setLocalDescription(answer);
            signalingChannel.send(
              JSON.stringify({
                type: "answer",
                data: { sdp: answer },
              })
            );
          });
      }

      if (response.type === "answer") {
        // If answer received, set it as the remote description
        const answer = new RTCSessionDescription(response.data);
        peerConnection.current.setRemoteDescription(answer);
      }
    };

    // Auto create offer once WebSocket is connected
    const createOffer = () => {
      peerConnection.current
        .createOffer()
        .then((offer) => {
          peerConnection.current.setLocalDescription(offer);
          // Send the offer to the other peer via signaling
          signalingChannel.send(
            JSON.stringify({
              type: "offer",
              data: { sdp: offer },
            })
          );
        })
        .catch((error) => console.error("Error creating offer:", error));
    };

    // createOffer(); 

    return () => {
      signalingChannel.close();
      peerConnection.current.close();
    };
  }, []);

  return (
    <div className="send-container">
      <div className="qr-container">
        <div className="qr-text">Scan the QR code to send files</div>
        <QRCodeCanvas
          value={qrValue}
          size={250}
          level="H"
          bgColor="transparent"
          className="qr-code"
        />
      </div>

      <div className="code-container">
        <div className="code-text">Share this code with the receiver</div>
        <div className="parent-send-code-container">
          <div className="code-inputs-boxes">
            {code.map((digit, index) => (
              <div key={index} className="code-input-box">
                <input
                  type="text"
                  value={digit}
                  maxLength="1"
                  disabled
                  className="code-input"
                />
              </div>
            ))}
          </div>
          <TbReload
            style={{ cursor: "pointer", position: "absolute", right: "-3rem" }}
            color="var(--neutral-color)"
            size={"1.8rem"}
          />
        </div>
      </div>

      <div className="actions-buttons ">
        <button
          onClick={() => setIsSend(true)}
          className={`send-button ${isSend && "active"}`}
        >
          Send
        </button>
        <button
          onClick={() => {
            setIsSend(false);
            router.push("/receive");
          }}
          className={`receive-button ${!isSend && "active"}`}
        >
          Receive
        </button>
      </div>
    </div>
  );
}
