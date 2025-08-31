import { UserIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import Profile from "./Profile";

export default function Header() {
  const user = useSelector((state) => state.user);
  const [showProfile, setShowProfile] = React.useState(false);
  return (
    <div className="w-full bg-[var(--primary-color)]/5 py-2 px-4 flex justify-between items-center shadow-sm rounded-md">
      <div>
        <img src="/Swoosh-Logo.png" alt="Logo" className="h-16" />
      </div>
      <div
        onClick={() => {
          setShowProfile(true);
        }}
        className="h-12 w-12 flex items-center text-xl justify-center bg-[var(--blue-color)] text-white font-bold rounded-full cursor-pointer hover:scale-105 transition-transform"
      >
        {user?.name[0]?.toUpperCase()}
      </div>

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  );
}
