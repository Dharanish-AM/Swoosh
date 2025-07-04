import React from "react";
import yellowIllus from "../assets/icons/yellow-illus.png";
import greenIllus from "../assets/icons/green-illus.png";
import { Lock, LockKeyhole, RotateCcw } from "lucide-react";
import Logo from "../assets/Swoosh-Logo.png";
import NearbyDevices from "./NearbyDevices";

export default function Sender() {
  return (
    <div className="flex flex-col p-6 h-screen w-screen">
      <div>
        <img
          src={yellowIllus}
          alt="Yellow Illustration"
          className="absolute top-0 left-0 w-96 aspect-1"
        />
      </div>
      <div>
        <img
          src={greenIllus}
          alt="Green Illustration"
          className="absolute bottom-0 left-0 w-48 aspect-1"
        />
      </div>
      <div className="flex flex-col w-full mb-6">
        <img src={Logo} alt="Swoosh Logo" className="w-22 h-22" />
      </div>
      <div className="flex flex-col items-center w-full h-full justify-space">
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <span className="font-black text-3xl">
            Swoosh Your Files Instantly!
          </span>
          <span className="font-bold text-2xl">
            Fast, Secure, and Hassle-Free File Transfers
          </span>
        </div>
        {/* main */}
        <div className="flex flex-col w-full h-full items-center justify-center gap-6 mb-8">
          <NearbyDevices />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-center ">
        <LockKeyhole size={18} className="text-[#737373]" />
        <div className="text-[#737373]">Files are end-to-end encrypted</div>
      </div>
      <div>
        <img
          src={greenIllus}
          alt="Green Illustration"
          className="absolute top-0 right-0 scale-x-[-1] scale-y-[-1] w-48 aspect-1"
        />
      </div>
      <div>
        <img
          src={yellowIllus}
          alt="Yellow Illustration"
          className="absolute bottom-0 right-0 transform scale-x-[-1] scale-y-[-1] w-96 aspect-1"
        />
      </div>
    </div>
  );
}
