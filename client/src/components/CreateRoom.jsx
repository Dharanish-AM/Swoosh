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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Room</h2>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room Name
            </label>
            <input
              type="text"
              name="roomName"
              className="w-full border rounded px-3 py-2"
              value={formData.roomName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="roomDescription"
              rows="3"
              className="w-full border rounded px-3 py-2"
              value={formData.roomDescription}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Receivers
            </label>
            <input
              type="number"
              name="maxReceivers"
              className="w-full border rounded px-3 py-2"
              value={formData.maxReceivers}
              onChange={handleChange}
            />
          </div>
          <input type="hidden" name="userId" value={formData.userId} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 cursor-pointer rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--primary-color)] text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
