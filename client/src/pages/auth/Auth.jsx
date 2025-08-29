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
      <div className="flex flex-col sm:flex-row items-center w-full h-full">
        <div className="w-full sm:w-1/2 h-full flex justify-center items-center p-4">
          {isSignup ? <Signup /> : <Login />}
        </div>
        <div className="hidden sm:flex w-1/2 h-full justify-center items-center bg-white"></div>
      </div>
    </div>
  );
}
