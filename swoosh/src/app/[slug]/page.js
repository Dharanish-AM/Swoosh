"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Send from "@/components/Send";
import Receive from "@/components/Receive";
import Image from "next/image";
import Logo from "@/assets/icons/Swoosh-Logo.png";

export default function MainPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug?.trim() || "send";

  return (
    <div className="bg-primary h-screen w-screen flex flex-col">
      <div className="bg-amber-300 flex flex-row items-center justify-between h-25 w-full pl-4 pr-4">
        <Image
          src={Logo}
          alt="logo"
          priority
          quality={100}
          style={{
            width: "5rem",
            height: "5rem",
          }}
        />
      </div>

      {/* Navigation Logic */}
      {slug === "send" ? <Send /> : slug === "receive" && <Receive />}
    </div>
  );
}
