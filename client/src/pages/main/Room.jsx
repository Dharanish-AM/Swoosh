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
import { Download } from "lucide-react";

export default function Room() {
  const roomId = useParams().id;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [activeTab, setActiveTab] = useState("files");

  console.log(currentRoom);

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

  return (
    <div className="w-screen h-screen p-8 overflow-y-auto bg-[var(--bg-color)]">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-semibold text-[var(--text-color)]">
              {currentRoom?.roomName || "Room"}
            </h1>
            <span className="px-3 py-1 rounded-full bg-[var(--accent-color)] text-[var(--text-color)] text-sm font-medium">
              Owner: {currentRoom?.sender?.name || "Unknown"}
            </span>
            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 cursor-pointer select-none">
              <span className="text-[var(--text-color)] font-mono text-sm">
                Code: {currentRoom?.roomCode?.toUpperCase()}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--text-color)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16h8M8 12h8m-8-4h8M5 20h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </div>
            <button className="ml-4 px-4 py-1 rounded-lg bg-[var(--primary-color)] text-white hover:opacity-90 font-medium shadow-sm">
              QR
            </button>
          </div>
          <p className="text-[var(--text-color)]/80 max-w-xl">
            {currentRoom?.roomDescription}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-3 text-sm text-[var(--text-color)]">
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
          <div>
            <div className="text-[var(--text-color)]/70 text-xs">
              Expires at {currentRoom?.expiresAt}
            </div>
          </div>
          <div>
            <span className="font-semibold">
              {Array.isArray(currentRoom?.receivers)
                ? currentRoom.receivers.length
                : 0}
            </span>{" "}
            online
          </div>
        </div>
      </div>

      {/* Tabs Navigation & Content */}
      <div className="mb-8 border-b border-gray-300">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("files")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 ${
              activeTab === "files"
                ? "border-[var(--primary-color)] text-[var(--primary-color)] font-semibold"
                : "border-transparent text-[var(--text-color)]/70 hover:text-[var(--text-color)] hover:border-[var(--accent-color)] text-sm font-medium"
            }`}
          >
            Files
          </button>
          {Number(currentRoom?.sender?.id) === Number(user.id) && (
            <button
              onClick={() => setActiveTab("receivers")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 ${
                activeTab === "receivers"
                  ? "border-[var(--primary-color)] text-[var(--primary-color)] font-semibold"
                  : "border-transparent text-[var(--text-color)]/70 hover:text-[var(--text-color)] hover:border-[var(--accent-color)] text-sm font-medium"
              }`}
            >
              Receivers
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "files" && (
          <div>
            {/* File Upload Area - Only for Room Owner */}
            {currentRoom?.status !== "EXPIRED" &&
              Number(currentRoom?.sender?.id) === Number(user.id) && (
                <div className="mb-10">
                  <label
                    htmlFor="file-upload"
                    className="relative flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-xl h-48 cursor-pointer hover:border-[var(--primary-color)] transition-colors"
                  >
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-12 w-12 text-[var(--text-color)] mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M7 16h10M7 16l-4 4m0 0l4 4m-4-4h18"
                        />
                      </svg>
                      <p className="text-[var(--text-color)] mb-2">
                        Drag & drop files here
                      </p>
                      <button
                        type="button"
                        className="inline-block px-6 py-2 border border-gray-300 rounded-md text-[var(--text-color)] hover:bg-gray-100 transition"
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
              <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
                Shared Files
              </h2>
              <ul className="space-y-4">
                {currentRoom?.files?.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between w-full bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10">
                        <FileIcon
                          extension={
                            file.fileName?.split(".").pop() ||
                            file.fileType?.split("/")?.[1] ||
                            ""
                          }
                          {...(defaultStyles[file.fileName?.split(".").pop()] ||
                            {})}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-color)]">
                          {file.fileName}
                        </p>
                        <p className="text-[var(--text-color)]/70 text-sm">
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
                    <div className="flex flex-col items-end space-y-1">
                      {file.status === "COMPLETED" && (
                        <span className="px-3 py-1 rounded-full bg-[var(--primary-color)]/20 text-[var(--primary-color)] text-xs font-semibold">
                          COMPLETED
                        </span>
                      )}
                      {file.status === "IN_PROGRESS" && (
                        <span className="px-3 py-1 rounded-full bg-[var(--accent-color)]/30 text-[var(--accent-color)] text-xs font-semibold">
                          IN PROGRESS
                        </span>
                      )}
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() =>
                            handleDownloadFile(file.id, file.fileName)
                          }
                          className="flex items-center px-3.5 py-2 rounded-md bg-[var(--blue-color)] text-white text-sm hover:opacity-90"
                        >
                          <Download size={17} className="mr-2" />
                          Download
                        </button>
                        {Number(currentRoom?.sender?.id) ===
                          Number(user.id) && (
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="flex items-center px-3.5 py-2 rounded-md bg-[var(--red-color)] text-white text-sm hover:opacity-90"
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
            <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
              Receivers
            </h2>
            <ul className="space-y-1 text-[var(--text-color)]">
              {Array.isArray(currentRoom?.receivers) &&
              currentRoom.receivers.length > 0 ? (
                currentRoom.receivers.map((receiver, idx) => (
                  <li
                    key={receiver.id || idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <span>{receiver?.name ?? "Unknown"}</span>
                      {receiver?.email && (
                        <span className="text-[var(--text-color)]/70 ml-2">
                          ({receiver.email})
                        </span>
                      )}
                    </div>
                    {Number(currentRoom?.sender?.id) === Number(user.id) && (
                      <button
                        onClick={() => handleRemoveReceiver(receiver.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-sm text-[var(--text-color)]/70">
                  No receivers found.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
