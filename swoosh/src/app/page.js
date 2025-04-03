"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Send from "@/components/Send";
import Receive from "@/components/Receive";
import Image from "next/image";
import Logo from "@/assets/icons/Swoosh-Logo.png";
import { FaLock } from "react-icons/fa";

export default function MainPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug?.trim() || "send";

  return (
    <div className="bg-primary h-screen w-screen flex flex-col justify-between">
      <div className="flex flex-row items-center justify-between h-25 w-full pl-4 pr-4">
        <Image
          src={Logo}
          alt="logo"
          priority
          quality={100}
          style={{
            width: "4.5rem",
            height: "4.5rem",
            aspectRatio: "1/1",
            objectFit: "contain",
          }}
        />
      </div>

      <div className="flex flex-row w-screen h-15 items-center justify-center pl-4 pr-4">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background:"red"
          }}
        >
          <FaLock size={"1rem"} color="#737373" />
          <div
            style={{
              fontSize: "1rem",
              color: "#737373",
              marginLeft: "0.5rem",
            }}
          >
            Files are end-to-end encrypted
          </div>
        </div>
      </div>

      {/* {slug === "send" ? <Send /> : slug === "receive" && <Receive />} */}
    </div>
  );
}
