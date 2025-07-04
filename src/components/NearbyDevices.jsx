import { ArrowLeft, Plus, SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileList from "./FileList";
import uploadIcon from "../assets/icons/upload-file.png";

export default function NearbyDevices() {
  const [devices, setDevices] = useState([
    { name: "Pixel-X1", ip: "192.168.1.10" },
    { name: "MacBook-Demo", ip: "192.168.1.11" },
    { name: "Asus-Rogue", ip: "192.168.1.15" },
    { name: "Sabari-PC", ip: "192.168.1.22" },
    { name: "Zenfone-Link", ip: "192.168.1.33" },
    { name: "Asus-Tuf", ip: "192.168.1.44" },
    { name: "Asus-Tuf", ip: "192.168.1.44" },
    { name: "Asus-Tuf", ip: "192.168.1.44" },
    { name: "Asus-Tuf", ip: "192.168.1.44" },
    { name: "Asus-Tuf", ip: "192.168.1.44" },
    { name: "Asus-Tuf ", ip: "192.168.1.44" },
    { name: "Asus-Tuf ", ip: "192.168.1.44" },
    { name: "Asus-Tuf ", ip: "192.168.1.44" },
    { name: "Asus-Tuf ", ip: "192.168.1.44" },
    { name: "Asus-Tuf ", ip: "192.168.1.44" },
  ]);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState();

  const [myDevice, setMyDevice] = useState({
    name: "Dharanishs-MacBook-Pro",
    ip: "192.168.1.1",
  });
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      console.log("Selected files:", {
        count: selectedFiles.length,
        files: Array.from(selectedFiles).map((file) => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type,
          lastModified: new Date(file.lastModified).toLocaleString(),
        })),
      });
    } else {
      console.log("No files selected");
    }
  }, [selectedFiles]);

  useEffect(() => {
    const swoosh = window?.swoosh;

    if (!swoosh) return;

    const handleDeviceList = (deviceList) => {
      setDevices(deviceList);
      // console.log("🟢 Devices updated:", deviceList);
    };

    const handleSelfDevice = (info) => {
      setMyDevice(info);
      console.log("🟢 My Device:", info);
    };

    swoosh.onDevicesUpdated(handleDeviceList);
    swoosh.onSelfDevice(handleSelfDevice);
  }, []);

  const handleSend = () => {
    
  }

  return (
    <div className="flex w-3/4 h-[35rem] flex-col border z-1 border-[#DDDDDD] bg-[#F0FFF9]/30 backdrop-blur-sm rounded-2xl">
      <div className="w-full h-16 items-center px-6 justify-between border-b-1 border-[#DDDDDD] flex">
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate("/")}
            className="flex items-center justify-center bg-[#FFD65A] px-2 h-10 rounded-full aspect-1 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-[#333]" />
          </div>
          <div className=" font-semibold text-l">
            {selectedDevice ? "Choose Files" : "Nearby Devices"}
          </div>
        </div>
        <div className="font-medium items-center justify-center gap-2 flex text-[#27548A]">
          <span className="w-2 h-2 aspect-1 bg-green-500 rounded-full"></span>
          <span>{myDevice && `${myDevice.name} - ${myDevice.ip}`}</span>
        </div>
      </div>
      <div className="w-full h-full flex flex-col overflow-y-auto gap-6 p-7">
        {!selectedDevice ? (
          devices.map((device, i) => {
            return (
              <div
                key={i}
                className="w-full border-b-1 border-[#dddddd96] items-center justify-between font-medium text-l flex p-2"
              >
                <div>
                  {i + 1}. {device.name} - {device.ip}
                </div>
                <div
                  onClick={() => {
                    setSelectedDevice(device);
                  }}
                  className="flex items-center justify-center cursor-pointer bg-[#16C47F] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#87d8b8] transition duration-200"
                >
                  Select Device
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex relative flex-col h-full">
            <div className="flex border-b border-[#DDDDDD] items-center justify-between pb-4">
              <div className="font-medium text-[#737373] italic">
                <span className="text-black">Selected Device:</span>{" "}
                {selectedDevice.name} - {selectedDevice.ip}
              </div>
              <div
                onClick={() => setSelectedDevice("")}
                className="font-medium flex items-center justify-center cursor-pointer bg-[#F16053] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#9c554e] transition duration-200"
              >
                Unselect Device
              </div>
            </div>
            {!selectedFiles ? (
              <div
                className="w-full h-full cursor-pointer flex flex-col items-center justify-center"
                onClick={() => inputRef.current?.click()}
              >
                <img src={uploadIcon} alt="Upload Icon" className="w-24 h-24" />
                <span className="flex-wrap font-regular text-[#333333] w-54 transform text-center">
                  Drag & Drop your files here or Click to Choose
                </span>
                <input
                  id="file-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFiles(e.target.files);
                    }
                  }}
                  ref={inputRef}
                  type="file"
                  multiple
                  accept="*"
                  className="w-full h-full cursor-pointer"
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <>
                <FileList files={selectedFiles} />

                <div className="flex flex-row gap-4 absolute bottom-0 right-0">
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="bg-[#27548A] text-white py-2 font-medium cursor-pointer px-4 flex w-fit flex-row rounded-xl items-center justify-center gap-2"
                  >
                    Add More Files <Plus size={20} />
                  </div>
                  <div className="bg-[#FFD65A] text-[#333] py-2 font-medium cursor-pointer px-4 flex w-fit flex-row rounded-xl items-center justify-center gap-2">
                    Send <SendHorizonal size={20} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
