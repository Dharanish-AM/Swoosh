import React from "react";
import { useLocation } from "react-router-dom";
import Signup from "../../components/Signup";
import Login from "../../components/Login";

export default function Auth() {
  const location = useLocation().pathname;
  const isSignup = location === "/signup";

  return (
    <div className="w-screen h-screen bg-[var(--primary-color)]/10 flex flex-col">
      <div className="w-full p-3 flex items-center">
        <img src="/Swoosh-Logo.png" alt="Logo" className="h-16" />
      </div>
      <div className="flex items-center w-full h-full">
        <div className="h-full flex justify-center items-center w-1/2">
          {isSignup ? <Signup /> : <Login />}
        </div>
        <div className="h-full flex justify-center items-center w-1/2"></div>
      </div>
    </div>
  );
}
