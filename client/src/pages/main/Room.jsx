import React, { useEffect, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  removeFile,
  removeUserFromRoom,
  sendFile,
} from "../../services/userService";
import toast from "react-hot-toast";
import { BounceLoader } from "react-spinners";
import { Clipboard, CloudUpload, Download, QrCode } from "lucide-react";
import QRCode from "../../components/QRCode";

export default function Room() {
  const roomId = useParams().id;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [timeLeft, setTimeLeft] = useState(null);

  
  function formatTimeLeft(seconds) {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  
  useEffect(() => {
    if (user) {
      const allRooms = [
        ...(user.createdRooms || []),
        ...(user.joinedRooms || []),
      ];
      allRooms.forEach((room) => {
        if (room.id === Number(roomId)) {
          setCurrentRoom(room);
        }
      });
    }
  }, [user, roomId]);

  
  useEffect(() => {
    if (!currentRoom?.expiresAt) {
      setTimeLeft(null);
      return;
    }
    
    const calcTimeLeft = () =>
      Math.max(
        Math.floor(
          (new Date(currentRoom.expiresAt).getTime() - Date.now()) / 1000
        ),
        0
      );
    setTimeLeft(calcTimeLeft());
    if (currentRoom.status === "EXPIRED") return;
    const interval = setInterval(() => {
      const secondsLeft = calcTimeLeft();
      setTimeLeft(secondsLeft);
      if (secondsLeft <= 0) {
        setCurrentRoom((prev) =>
          prev ? { ...prev, status: "EXPIRED" } : prev
        );
      }
    }, 1000);
    return () => clearInterval(interval);
    
  }, [currentRoom?.expiresAt, currentRoom?.status]);

  const handleRemoveReceiver = async (removeUserId) => {
    try {
      const response = await removeUserFromRoom(
        user.id,
        currentRoom.id,
        removeUserId,
        dispatch
      );
      if (response.status === 200) {
        toast.success("User removed");
      }
    } catch (error) {
      toast.error("Failed to remove user", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && currentRoom) {
      try {
        setUploading(true);
        const response = await sendFile(
          user.id,
          currentRoom.id,
          file,
          dispatch
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("File uploaded successfully");
        }
      } catch (error) {
        console.error("File upload failed:", error);
        toast.error("File upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/file/serve/${user.id}/${
          currentRoom.id
        }/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleRemoveFile = async (fileId) => {
    if (!currentRoom || Number(currentRoom.sender?.id) !== Number(user.id)) {
      toast.error("Only the room owner can remove files");
      return;
    }
    try {
      const response = await removeFile(
        user.id,
        currentRoom.id,
        fileId,
        dispatch
      );
      if (response.status == 200) {
        toast.success("File removed successfully");
      }
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    }
  };

  if (uploading) {
    return (
      <div className="flex w-screen justify-center items-center h-screen">
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }

  const handleLeaveRoom = () => {
    return null;
  };

  return (
    <div className="w-screen h-screen p-4 sm:p-8 overflow-y-auto bg-gray-50">
      <div className="max-w-screen mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8 w-full">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center space-x-4 mb-2">
              <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                {currentRoom?.roomName || "Room"}
              </h1>
              <span className="px-3 shrink-0 py-1 rounded-full bg-[var(--accent-color)] text-[var(--accent-color)]] text-sm font-medium mt-2 md:mt-0">
                Owner: {currentRoom?.sender?.name || "Unknown"}
              </span>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition mt-2 md:mt-0">
                <span className="font-mono">
                  Code: {currentRoom?.roomCode?.toUpperCase()}
                </span>
                <Clipboard size={18} />
              </div>
              <button
                onClick={() => setShowQR((prev) => !prev)}
                aria-label="Show QR Code"
                className="p-1.5 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 text-gray-500 mt-2 md:mt-0"
                type="button"
              >
                <QrCode size={18} />
              </button>
            </div>
            <p className="text-gray-600 max-w-xl mt-2">
              {currentRoom?.roomDescription}
            </p>
            <div className="flex flex-col mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <span
                    className={`h-3 w-3 rounded-full inline-block ${
                      currentRoom?.status === "ACTIVE"
                        ? "bg-[var(--primary-color)]"
                        : currentRoom?.status === "EXPIRED"
                        ? "bg-[var(--red-color)]"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="font-semibold">{currentRoom?.status}</span>
                </span>
              </div>
              <div className="text-[var(--text-color)]/70 text-sm">
                {currentRoom?.status === "EXPIRED" ? (
                  <span>Expired</span>
                ) : currentRoom?.expiresAt ? (
                  <span>
                    Expires in:{" "}
                    <span className="font-mono">
                      {formatTimeLeft(timeLeft ?? 0)}
                    </span>
                  </span>
                ) : (
                  "Unknown expiration"
                )}
              </div>
              <div>
                <span className="text-sm font-semibold">
                  {Array.isArray(currentRoom?.receivers)
                    ? currentRoom.receivers.length
                    : 0}
                </span>{" "}
                online
              </div>
            </div>
          </div>
          <div>
            {Number(currentRoom?.sender?.id) !== Number(user.id) && (
              <div className="pt-2">
                <button
                  onClick={handleLeaveRoom}
                  className="px-3 py-1 rounded-lg bg-[var(--red-color)] text-white text-sm transition mt-2 md:mt-0"
                  type="button"
                >
                  Leave Room
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 border-b border-gray-300">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("files")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 ${
                activeTab === "files"
                  ? "border-[var(--blue-color)] text-[var(--blue-color)] font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium"
              }`}
            >
              Files
            </button>
            {Number(currentRoom?.sender?.id) === Number(user.id) && (
              <button
                onClick={() => setActiveTab("receivers")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 ${
                  activeTab === "receivers"
                    ? "border-[var(--blue-color)] text-[var(--blue-color)] font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium"
                }`}
              >
                Receivers
              </button>
            )}
          </nav>
        </div>

        <div>
          {activeTab === "files" && (
            <div>
              {currentRoom?.status !== "EXPIRED" &&
                Number(currentRoom?.sender?.id) === Number(user.id) && (
                  <div className="mb-10">
                    <label
                      htmlFor="file-upload"
                      className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 sm:h-44 cursor-pointer hover:border-[var(--primary-color)] transition-colors bg-white"
                    >
                      <div className="text-center">
                        <CloudUpload className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                        <p className="text-gray-600 mb-2">
                          Drag & drop files here
                        </p>
                        <button
                          type="button"
                          className="inline-block px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                          onClick={() =>
                            document.getElementById("file-upload").click()
                          }
                        >
                          Choose Files
                        </button>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                )}

              {/* Shared Files List */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Shared Files
                </h2>
                <ul className="space-y-4">
                  {currentRoom?.files?.map((file, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-10 h-10">
                          <FileIcon
                            extension={
                              file.fileName?.split(".").pop() ||
                              file.fileType?.split("/")?.[1] ||
                              ""
                            }
                            {...(defaultStyles[
                              file.fileName?.split(".").pop()
                            ] || {})}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-wrap text-gray-800">
                            {file.fileName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {(() => {
                              const size = file.fileSize;
                              let sizeStr = "";
                              if (size < 1024 * 1024) {
                                sizeStr = (size / 1024).toFixed(1) + " KB";
                              } else if (size < 1024 * 1024 * 1024) {
                                sizeStr =
                                  (size / (1024 * 1024)).toFixed(1) + " MB";
                              } else {
                                sizeStr =
                                  (size / (1024 * 1024 * 1024)).toFixed(1) +
                                  " GB";
                              }
                              const mimeSubtype =
                                file.fileType?.split("/")?.[1] || file.fileType;
                              const formattedDate = new Date(
                                file.sentAt
                              ).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              });
                              return `${sizeStr} · ${mimeSubtype} · Uploaded by ${
                                currentRoom.sender?.name || "Unknown"
                              } · ${formattedDate}`;
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 mt-4 sm:mt-0">
                        {file.status === "COMPLETED" && (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            COMPLETED
                          </span>
                        )}
                        {file.status === "IN_PROGRESS" && (
                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                            IN PROGRESS
                          </span>
                        )}
                        <div className="flex flex-wrap justify-end space-x-2 mt-2">
                          <button
                            onClick={() =>
                              handleDownloadFile(file.id, file.fileName)
                            }
                            className="flex cursor-pointer items-center px-3.5 py-2 rounded-lg bg-[var(--blue-color)] text-white text-sm  transition"
                          >
                            <Download size={17} className="mr-2" />
                            Download
                          </button>
                          {Number(currentRoom?.sender?.id) ===
                            Number(user.id) && (
                            <button
                              onClick={() => handleRemoveFile(file.id)}
                              className="flex cursor-pointer items-center px-3.5 py-2 rounded-lg bg-[var(--red-color)] text-white text-sm  transition"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === "receivers" && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Receivers
              </h2>
              <ul className="space-y-1">
                {Array.isArray(currentRoom?.receivers) &&
                currentRoom.receivers.length > 0 ? (
                  currentRoom.receivers.map((receiver, idx) => (
                    <li
                      key={receiver.id || idx}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div>
                        <span>{receiver?.name ?? "Unknown"}</span>
                        {receiver?.email && (
                          <span className="text-gray-500 ml-2">
                            {receiver.email}
                          </span>
                        )}
                      </div>
                      {Number(currentRoom?.sender?.id) === Number(user.id) && (
                        <button
                          onClick={() => handleRemoveReceiver(receiver.id)}
                          className="px-2.5 py-1 rounded-lg bg-[var(--red-color)] text-white text-xs transition mt-2 sm:mt-0"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No receivers found.</li>
                )}
              </ul>
            </div>
          )}
        </div>
        {showQR && <QRCode room={currentRoom} setShowQr={setShowQR} />}
      </div>
    </div>
  );
}
