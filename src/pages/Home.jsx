import React, { useState } from "react";
import Logo from "../assets/Swoosh-Logo.png";
import QRCode from "react-qr-code";
import yellowIllus from "../assets/icons/yellow-illus.png";
import greenIllus from "../assets/icons/green-illus.png";
import { Lock, LockKeyhole, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const oneTimeCode = useState(["1", "2", "2", "5", "7"]);
  const navigate = useNavigate();

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
        <div className="flex flex-col items-center justify-center gap-1 relative mb-8">
          <div className="font-medium mb-3">
            Share this code with the receiver to connect
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex flex-row items-center gap-4">
              {oneTimeCode[0].map((item, index) => {
                return (
                  <div
                    className="w-13 h-13 border-[#16C47F] border bg-[#F8F8F8] flex items-center justify-center rounded-lg"
                    key={index}
                  >
                    <span className="text-xl font-semibold">{item}</span>
                  </div>
                );
              })}
            </div>
            <div className="-right-10 cursor-pointer absolute ">
              <RotateCcw className="w-9 h-9 text-[#27548A]" />
            </div>
          </div>
          <div className="mt-3 font-medium text-[#737373]">
            Expires in{" "}
            <span className="font-semibold text-[#F93827]">07:07</span> minutes
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 justify-between max-w-md bg-[#F1F1F1] rounded-full">
          <div className="flex cursor-pointer py-3 px-16 rounded-full item-center justify-center font-semibold bg-[#FFD65A]">
            Send
          </div>
          <div className="flex cursor-pointer py-3 px-16 rounded-full item-center justify-center font-semibold">
            Receive
          </div>
        </div>
        <div
          onClick={() => navigate("/send")}
          className="text-[#27548A] font-medium italic text-sm hover:underline mt-4 cursor-pointer transition duration-200"
        >
          Show Nearby Devices
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
