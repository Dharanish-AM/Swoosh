import React, { useEffect, useState } from "react";

export default function NearbyDevices() {
   const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (window?.swoosh?.onDevicesUpdated) {
      window.swoosh.onDevicesUpdated(setDevices);
    }
  }, []);

  return (
    <div className="flex w-3/4 h-full flex-col border z-1 border-[#DDDDDD] bg-[#F0FFF9]/30 backdrop-blur-sm rounded-2xl">
      <div className="w-full h-16 border-b-1 border-[#DDDDDD] flex"></div>
      <div className="w-full h-full flex">{
        devices.map((devices)=>{
            console.log(devices)
            return <div className="w-full h-full flex">{devices.name}</div>
        })
        }</div>
    </div>
  );
}
