import React from "react";

export default function RoomCard({ room }) {
  return (
    <div
      key={room.id}
      className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between"
    >
      <div>
        <h3 className="font-bold text-gray-800 mb-1">Room {room.roomCode}</h3>
        <p className="text-sm text-gray-600">
          Created {new Date(room.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Expires {new Date(room.expiresAt).toLocaleString()}
        </p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          Active
        </span>
        <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">
          Enter Room
        </button>
      </div>
    </div>
  );
}
