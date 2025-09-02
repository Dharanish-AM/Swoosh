import React from "react";
import { useSelector } from "react-redux";
import Profile from "./Profile";

export default function Header() {
  const user = useSelector((state) => state.user);
  const [showProfile, setShowProfile] = React.useState(false);
  return (
    <div className="w-full bg-white border-gray-200 py-3 px-6 flex justify-between items-center shadow-sm">
      <div>
        <img src="/Swoosh-Logo.png" alt="Logo" className="h-13 w-auto object-contain" />
      </div>
      <div
        onClick={() => {
          setShowProfile(true);
        }}
        className="h-10 w-10 flex items-center justify-center text-lg font-medium rounded-full bg-[var(--text-color)] text-white cursor-pointer hover:bg-[var(--primary-color)]600 transition"
      >
        {user?.name[0]?.toUpperCase()}
      </div>

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  );
}
