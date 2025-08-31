import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function Profile({ onClose }) {
  const user = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // Add API call to change password here
    toast.success("Password changed successfully");
    setShowChangePassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveProfile = () => {
    // Add API call to update name and email here
    toast.success("Profile updated successfully");
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Profile Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-10 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700 text-xl font-bold"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {editMode ? (
          <div className="mb-4">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full mb-2 p-2 border rounded-md"
            />
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 bg-[var(--blue-color)] text-white rounded-md hover:opacity-90 transition mr-2"
                onClick={handleSaveProfile}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:opacity-90 transition"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <div className="flex justify-start space-x-2 mt-6">
              <button
                className="px-3 cursor-pointer py-1 bg-[var(--blue-color)] text-white rounded-md hover:opacity-90 transition"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="px-4 cursor-pointer py-2 bg-[var(--blue-color)] text-white rounded-md hover:opacity-90 transition"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowChangePassword(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-10 relative">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-[var(--blue-color)] text-white rounded-md hover:opacity-90 transition mr-2"
                onClick={handleChangePassword}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:opacity-90 transition"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
