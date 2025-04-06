import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req) {
  try {
    const { code, link } = await req.json();

    let sessionCode = code;

    // Extract session code from link if needed
    if (!sessionCode && link) {
      const match = link.match(/(\d{5})$/);
      if (match) {
        sessionCode = match[1];
      }
    }

    if (!sessionCode || !/^\d{5}$/.test(sessionCode)) {
      return NextResponse.json({ error: "Invalid session code or link" }, { status: 400 });
    }

    // Retrieve MAC address linked to the session
    const mac = await redis.hget("session_codes", sessionCode);
    if (!mac) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get session details
    const sessionData = await redis.hgetall(`session:${mac}`);
    if (!sessionData || Date.now() > sessionData.expiresAt) {
      return NextResponse.json({ error: "Session expired" }, { status: 404 });
    }

    // Retrieve WebRTC offer from Redis
    const webrtcOffer = await redis.hget(`webrtc:${mac}`, "offer");
    if (!webrtcOffer) {
      return NextResponse.json({ error: "No WebRTC offer found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Session found",
      sender: mac,
      link: sessionData.link,
      webrtcOffer, // Send WebRTC offer to the receiver
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}