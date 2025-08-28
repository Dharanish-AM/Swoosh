import React from "react";
import { useLocation } from "react-router-dom";

export default function Auth() {
  const location = useLocation().pathname;
  const isSignup = location === "/signup";

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full h-20 bg-red-50 flex justify-center items-center"></div>
      <div>
        {isSignup ? (
          <div>
          </div>
        ) : (
          <div>
          </div>
        )}
      </div>
    </div>
  );
}
