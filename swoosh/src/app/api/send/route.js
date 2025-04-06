import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const SESSION_EXPIRY = 600; // 10 minutes in seconds

// Generate a unique 5-digit session code that isn't already in Redis
const generateUniqueCode = async () => {
  let code;
  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (await redis.hexists("session_codes", code)); // Check if code already exists
  return code;
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const ip = searchParams.get("ip");
    const mac = searchParams.get("mac");
    const webrtcOffer = searchParams.get("webrtcOffer");

    if (!name || !ip || !mac || !webrtcOffer) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Check if session already exists for this MAC
    const existingSession = await redis.hgetall(`session:${mac}`);

    if (existingSession?.code && Date.now() < existingSession.expiresAt) {
      return NextResponse.json({
        message: "Session already active",
        code: existingSession.code,
        link: existingSession.link,
        status: existingSession.status,
        webrtcOffer: existingSession.webrtcOffer, // Include existing offer if any
      });
    }

    // Generate a unique session code
    const sessionCode = await generateUniqueCode();
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const shareableLink = `${baseUrl}/join/${sessionCode}`;

    // Store session details in Redis
    await redis.hset(`session:${mac}`, {
      code: sessionCode,
      link: shareableLink,
      status: "waiting",
      expiresAt: Date.now() + SESSION_EXPIRY * 1000,
      webrtcOffer, // Store WebRTC offer
    });

    await redis.hset("session_codes", sessionCode, mac);
    await redis.sadd("active_sessions", mac);

    // Set expiry for session data
    await redis.expire(`session:${mac}`, SESSION_EXPIRY);
    await redis.expire("session_codes", SESSION_EXPIRY);
    await redis.expire("active_sessions", SESSION_EXPIRY);

    return NextResponse.json({
      message: "Session created",
      code: sessionCode,
      link: shareableLink,
      status: "waiting",
      webrtcOffer, // Return stored offer
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
