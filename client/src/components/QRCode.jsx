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
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 cursor-pointer"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-md p-8 max-w-md w-full flex flex-col gap-6 cursor-default"
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-[#305C91] text-xl">Room QR Code</h2>
          <button
            onClick={() => setShowQr(false)}
            className="text-[#305C91] hover:text-[#1e4470] transition-colors"
            aria-label="Close QR code modal"
          >
            <X size={24} />
          </button>
        </div>

        <div
          ref={qrRef}
          className="bg-gray-50 rounded-xl border border-gray-200 flex justify-center items-center p-6"
        >
          <QRCodeLib value={shareUrl  || "No Code"} size={192} />
        </div>

        <div
          onClick={() => copyToClipboard(room?.roomCode?.toUpperCase()  || "")}
          className="flex items-center gap-3 cursor-pointer select-all bg-green-50 px-4 py-2 rounded-md"
        >
          <div className="flex flex-col flex-1">
            <span className="text-gray-400 text-xs mb-1">Room Code</span>
            <span className="text-[#305C91] font-bold font-mono text-lg">
              {room?.roomCode?.toUpperCase()  || "N/A"}
            </span>
          </div>
          <Clipboard size={20} className="text-[#305C91]" />
        </div>
        {copied && (
          <p className="text-green-600 text-sm mt-1">Copied to clipboard!</p>
        )}  

        <p className="text-gray-500 text-sm">
          Scan this QR code or share the room code to invite others
        </p>

        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs">Share URL</span>
          <a onClick={()=>{
            window.open(shareUrl, "_blank");
          }} className="font-mono text-[#305C91] break-all cursor-pointer select-all">
            {shareUrl}
          </a>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={downloadQRCode}
            className="border border-[#305C91] text-[#305C91] bg-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            type="button"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={shareRoom}
            className="bg-[#16C47F] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            type="button"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>

        {timeLeft && (
          <p className="text-gray-400 text-sm mt-4">Expires in: {timeLeft}</p>
        )}
      </div>
    </div>
  );
}
