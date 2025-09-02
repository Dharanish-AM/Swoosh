import React, { useState } from "react";
import { joinRoom } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function JoinRoom({onClose}) {
  const userId = useSelector((state) => state.user.id);
  const [roomCode, setRoomCode] = useState("");
  const dispatch = useDispatch();
  console.log(roomCode);

  const handleJoinRoom = async () => {
    try {
      const lowerRoomCode = roomCode.toLowerCase();
      const response = await joinRoom(userId,lowerRoomCode, dispatch);
      if(response.status === 200){
        onClose();
        toast.success("Room Joined Successfully!")
      }
      else{
        toast.error("Failed to join room. Please check the room code.");
      }
    } catch (error) {
      console.error("Failed to join room:", error);
      toast.error(error.message || "Failed to join room. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50"></div>
      <div className="relative bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-8 flex flex-col">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Join Room</h2>
        <label htmlFor="room-code" className="mb-2 text-sm font-medium text-gray-600">
          Room Code
        </label>
        <input
          id="room-code"
          type="text"
          placeholder="Enter 6-digit room code"
          maxLength={6}
          onChange={(e) => {
            setRoomCode(e.target.value);
          }}
          className="mb-6 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleJoinRoom}
            className="px-3.5 py-2 text-sm cursor-pointer rounded-lg bg-[var(--primary-color)] text-white font-medium hover:bg-[var(--primary-color)] transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
