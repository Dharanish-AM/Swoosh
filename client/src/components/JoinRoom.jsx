import React, { useState } from "react";
import { joinRoom } from "../services/userService";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const dispatch = useDispatch();
  console.log(roomCode);

  const handleJoinRoom = async () => {
    try {
      const lowerRoomCode = roomCode.toLowerCase();
      const response = await joinRoom(lowerRoomCode, dispatch);
      if(response.status === 200){
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
      <div className="fixed inset-0 bg-black/40 bg-opacity-40"></div>
      <div className="relative bg-white max-w-sm w-full mx-4 rounded-xl shadow-2xl p-8 flex flex-col items-stretch">
        <h2 className="mb-6 text-center text-2xl font-semibold">Join Room</h2>
        <label htmlFor="room-code" className="mb-2 font-medium text-gray-700">
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
          className="mb-6 px-4 py-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
        />
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleJoinRoom}
            className="px-5 cursor-pointer py-2 rounded-md bg-[var(--primary-color)] text-white font-medium transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
