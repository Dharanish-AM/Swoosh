import { X, Clipboard, Download, Share2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import QRCodeLib from "react-qr-code";
import { toast } from "react-hot-toast";

export default function QRCode({ room, setShowQr }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/join/${room.roomCode.toUpperCase()}`;
  const qrRef = useRef(null);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const downloadQRCode = () => {
    try {
      const svg = qrRef.current.querySelector("svg");
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${room.roomCode}_QRCode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = url;
    } catch {
      // fallback or ignore errors
    }
  };

  const shareRoom = () => {
    const shareData = {
      title: `Join Room ${room.roomName}`,
      text: `Join my room "${room.roomName}" using this code: ${room.roomCode}`,
      url: shareUrl,
    };

    if (navigator.share) {
      // Web Share API supported
      navigator
        .share(shareData)
        .catch((err) => {
          console.error("Share failed:", err);
          toast.error("Sharing failed. URL copied to clipboard.");
          copyToClipboard(shareUrl);
        });
    } else {
      // Fallback: copy to clipboard for all other browsers
      copyToClipboard(shareUrl);
      toast.success("Room URL copied to clipboard");
    }
  };

  return (
    <div
      onClick={() => setShowQr(false)}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 cursor-pointer"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-11/12 sm:max-w-md flex flex-col gap-6 cursor-default"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Room QR Code</h2>
          <button
            onClick={() => setShowQr(false)}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close QR code modal"
          >
            <X size={24} />
          </button>
        </div>

        <div
          ref={qrRef}
          className="bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-4 sm:p-6"
        >
          <QRCodeLib value={shareUrl  || "No Code"} size={192} />
        </div>

        <div
          onClick={() => copyToClipboard(room?.roomCode?.toUpperCase()  || "")}
          className="flex items-center gap-3 cursor-pointer select-all bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg"
        >
          <div className="flex flex-col flex-1">
            <span className="text-gray-500 text-xs mb-1">Room Code</span>
            <span className="text-[var(--primary-color)] font-semibold font-mono text-lg">
              {room?.roomCode?.toUpperCase()  || "N/A"}
            </span>
          </div>
          <Clipboard size={20} className="text-gray-500" />
        </div>
        {copied && (
          <p className="text-green-500 text-sm mt-1">Copied to clipboard!</p>
        )}  

        <p className="text-gray-600 text-sm">
          Scan this QR code or share the room code to invite others
        </p>

        <div className="flex flex-col gap-1 mt-2">
          <span className="text-gray-500 text-xs">Share URL</span>
          <a onClick={()=>{
            window.open(shareUrl, "_blank");
          }} className="font-mono text-blue-600 break-all cursor-pointer select-all text-xs sm:text-sm hover:underline">
            {shareUrl}
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={downloadQRCode}
            className="border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full sm:w-auto"
            type="button"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={shareRoom}
            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[var(--primary-color)]600 transition w-full sm:w-auto"
            type="button"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>

        {timeLeft && (
          <p className="text-gray-500 text-sm mt-4">Expires in: {timeLeft}</p>
        )}
      </div>
    </div>
  );
}
