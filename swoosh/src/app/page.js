"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "../styles/Home.css";
import Send from "@/components/Send";
import Receive from "@/components/Receive";

export default function MainPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug?.trim() || "send";

  return (
    <div className="home-container">
     
      {slug === "send" || slug === "" ? (
        <Send />
      ) : (
        slug === "receive" && <Receive />
      )}
    </div>
  );
}
