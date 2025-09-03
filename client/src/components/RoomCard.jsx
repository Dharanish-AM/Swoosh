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
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deleteRoom } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function RoomCard({ room }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [selectedRoomQR, setSelectedRoomQR] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = user.id;

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

  const handleDelete = async () => {
    try {
      const response = await deleteRoom(user.id, room.id, dispatch);
      if (response.status === 200) {
        toast.success("Room deleted successfully");
      } else {
        toast.error("Failed to delete room. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error(error.message || "Failed to delete room. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 w-full max-w-md">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-lg text-gray-800 mr-2">
                {room.roomName}
              </p>
            </div>
            <p className="text-gray-600 text-sm mt-1">{room.roomDescription}</p>
            <p className="text-gray-400 text-xs">
              Owner:{" "}
              {room.sender?.name === user.name
                ? "Me"
                : room.sender?.name || "Unknown"}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setSelectedRoomQR(room);
                setShowQr(true);
              }}
              aria-label="Show QR Code"
              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500"
              type="button"
            >
              <QrCode size={18} />
            </button>

            <div
              onClick={handleCopy}
              className="bg-[var(--accent-color)]/70 px-2.5 py-1.5 font-semibold rounded-lg text-xs font-mono text-gray-700 flex items-center gap-1 cursor-pointer w-max transition"
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
            <Users size={16} className="text-gray-400" />
            <span>
              Members: {room.receivers.length ?? 0}/{room.maxReceivers ?? 0}
            </span>
          </div>
        </div>

        <div className="text-gray-500 text-xs flex flex-wrap gap-3">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-gray-400" />
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
            <Clock size={16} className="text-gray-400" />
            <span>{timeLeft} left</span>
          </div>
        </div>

        <div className="flex flex-wrap mt-4 justify-between items-center gap-4">
          <div />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete Room"
              className="rounded-lg cursor-pointer px-3 py-1.5 font-medium text-xs bg-[var(--red-color)] text-white transition flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete
            </button>
            {room.status !== "EXPIRED" && (
              <button
              onClick={()=>{
                navigate(`/room/${room.id}`);
              }}
                type="button"
                disabled={!isActive}
                className={`rounded-lg cursor-pointer px-3 py-1.5 font-medium text-xs transition ${
                  isActive
                    ? "bg-[var(--text-color)] text-white "
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
