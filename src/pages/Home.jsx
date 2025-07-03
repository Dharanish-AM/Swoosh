import React from "react";
import Logo from "../assets/Swoosh-Logo.png";
import QRCode from "react-qr-code";
import { Lock, LockKeyhole } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col p-6 h-screen w-screen">
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
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <div className="font-medium text-l">Scan QR Code</div>
          <div className="flex items-center justify-center p-6 bg-[#F9F8F8] border border-[#16C47F] rounded-2xl">
            <QRCode
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={"Ajalesh Babu"}
              viewBox={`0 0 256 256`}
              bgColor="transparent"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 mb-8">
          <div className="font-medium">
            Share this code with the receiver to connect
          </div>
          <div></div>
          <div>
            Expires in{" "}
            <span className="font-semibold text-[#F93827]">07:07</span> minutes
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between max-w-md bg-[#F1F1F1] rounded-full">
          <div className="flex py-3 px-16 rounded-full item-center justify-center font-semibold bg-[#FFD65A]">
            Send
          </div>
          <div className="flex py-3 px-16 rounded-full item-center justify-center font-semibold">
            Receive
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-center ">
        <LockKeyhole size={18} className="text-[#737373]" />
        <div className="text-[#737373]">Files are end-to-end encrypted</div>
      </div>
    </div>
  );
}
