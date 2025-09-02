import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../services/userService";

export default function CreateRoom({ onClose }) {
  const userId = useSelector((state) => state.user.id);
  const [formData, setFormData] = useState({
    roomName: "",
    roomDescription: "",
    maxReceivers: "",
    userId: userId,
  });
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    try {
      const response = await createRoom(userId, formData, dispatch);
      if (response.status === 201 || response.status === 200) {
        onClose();
        toast.success("Room Created Successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create room");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Room</h2>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Room Name
            </label>
            <input
              type="text"
              name="roomName"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={formData.roomName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="roomDescription"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={formData.roomDescription}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Max Receivers
            </label>
            <input
              type="number"
              name="maxReceivers"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={formData.maxReceivers}
              onChange={handleChange}
            />
          </div>
          <input type="hidden" name="userId" value={formData.userId} />
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-sm cursor-pointer rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 cursor-pointer text-sm rounded-lg bg-[var(--primary-color)] text-white font-medium transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
