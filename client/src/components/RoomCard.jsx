import React, { useState, useEffect } from "react";
import {
  Users,
  Clock,
  Lock,
  Unlock,
  QrCode,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import QRCode from "./QRCode";
import { useSelector } from "react-redux";

export default function RoomCard({ room }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [selectedRoomQR, setSelectedRoomQR] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const user = useSelector((state) => state.user);
  const currentUserId = user.id;

  console.log(room);

  const handleCopy = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = new Date(room.expiresAt) > new Date();

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const expiresAt = new Date(room.expiresAt);
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft("0m 0s");
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    updateTimeLeft();
    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [room.expiresAt]);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 w-full max-w-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-base text-[var(--text-color-light)] mr-2">
                {room.roomName}
              </p>
              <span
                className={`w-3 h-3 rounded-full ${
                  isActive ? "bg-green-500" : "bg-[var(--red-color)]"
                }`}
                title={isActive ? "Active" : "Expired"}
              ></span>
            </div>
            <p className="text-gray-600 text-sm mt-2">{room.roomDescription}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setSelectedRoomQR(room);
                setShowQr(true);
              }}
              aria-label="Show QR Code"
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              type="button"
            >
              <QrCode size={18} />
            </button>

            <div
              onClick={handleCopy}
              className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-mono text-gray-800 select-all flex items-center gap-2 cursor-pointer w-max"
              title="Click to copy room code"
            >
              <span
                style={{
                  fontFamily: "monospace",
                }}
              >
                {room.roomCode.toUpperCase()}
              </span>
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-gray-600 text-xs">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>
              Members: {room.membersCount ?? 0}/{room.maxReceivers ?? 0}
            </span>
          </div>
        </div>

        <div className="text-gray-700 text-xs flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>
              Created at{" "}
              {new Date(room.createdAt).toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(room.createdAt)
                .toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{timeLeft} left</span>
          </div>
        </div>

        <div className="flex flex-wrap mt-4 justify-between items-center gap-4">
          <div />
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Delete Room"
              className="rounded-xl cursor-pointer px-3 py-1.5 font-semibold text-xs bg-[var(--red-color)] text-white shadow-sm hover:bg-[var(--red-color)]/90 transition-colors duration-200 flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete
            </button>
            {room.status !== "EXPIRED" && (
              <button
                type="button"
                disabled={!isActive}
                className={`rounded-xl cursor-pointer px-3 py-1.5 font-semibold text-xs shadow-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-[var(--blue-color)] text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isActive && room.sender?.id === currentUserId
                  ? "View Room"
                  : "Enter Room"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showQr && <QRCode room={selectedRoomQR} setShowQr={setShowQr} />}
    </>
  );
}
