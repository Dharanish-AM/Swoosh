const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const redis = require("./lib/redis");

const wss = new WebSocketServer({ port: 8080 });
const SESSION_EXPIRY = 600; // 10 minutes
const sessions = new Map();

wss.on("connection", (ws, req) => {
  console.log("✅ New WebSocket connection established");

  ws.on("message", async (message) => {
    try {
      const { type, data } = JSON.parse(message);

      console.log(type, data);

      // ✅ CHECK EXISTING SESSION BEFORE CREATING A NEW ONE
      if (type === "check-session") {
        const { sessionId } = data;
        const existingSession = await redis.hgetall(`session:${sessionId}`);

        if (
          existingSession?.code &&
          Date.now() < Number(existingSession.expiresAt)
        ) {
          ws.send(
            JSON.stringify({
              type: "session-exists",
              data: {
                sessionId,
                code: existingSession.code,
                link: existingSession.link,
              },
            })
          );
        } else {
          ws.send(JSON.stringify({ type: "session-not-found" }));
        }
        return;
      }

      // ✅ CREATE A NEW SESSION (ONLY IF NOT ALREADY EXISTING)
      if (type === "create-session") {
        const { name, ip, sessionId } = data;

        if (!name || !ip) {
          ws.send(JSON.stringify({ error: "Missing parameters" }));
          return;
        }

        let newSessionId =
          sessionId || Math.random().toString(36).substring(2, 10);

        const existingSession = await redis.hgetall(`session:${newSessionId}`);
        if (
          existingSession?.code &&
          Date.now() < Number(existingSession.expiresAt)
        ) {
          ws.send(
            JSON.stringify({
              type: "session-exists",
              data: {
                sessionId: newSessionId,
                code: existingSession.code,
                link: existingSession.link,
              },
            })
          );
          return;
        }

        // 🔹 Otherwise, create a new session
        const sessionCode = Math.floor(
          10000 + Math.random() * 90000
        ).toString();
        const baseUrl = process.env.BASE_URL || "http://localhost:3000";
        const shareableLink = `${baseUrl}/join/${sessionCode}`;

        const sessionData = {
          sessionId: newSessionId,
          code: sessionCode,
          link: shareableLink,
          senderInfo: { name, ip },
          receiversDetails: [],
          status: "waiting",
          expiresAt: (Date.now() + SESSION_EXPIRY * 1000).toString(), // Convert to string for Redis
        };

        await redis.hset(`session:${newSessionId}`, sessionData);
        await redis.hset("session_codes", sessionCode, newSessionId);
        await redis.sadd("active_sessions", newSessionId);
        await redis.expire(`session:${newSessionId}`, SESSION_EXPIRY);
        sessions.set(newSessionId, ws);

        ws.send(
          JSON.stringify({
            type: "session-created",
            data: {
              sessionId: newSessionId,
              code: sessionCode,
              link: shareableLink,
            },
          })
        );
      }

      // ✅ JOIN AN EXISTING SESSION
      if (type === "join-session") {
        const { code, link, name, ip } = data || {}; // Default to an empty object if data is undefined

        if (!code && !link) {
          ws.send(
            JSON.stringify({ error: "Session code or link is required" })
          );
          return;
        }

        if (!name || !ip) {
          ws.send(
            JSON.stringify({ error: "Receiver name and IP are required" })
          );
          return;
        }

        // Determine session ID using code or link
        const sessionCode = code || link.split("/").pop();
        const sessionId = await redis.hget("session_codes", sessionCode);

        if (!sessionId) {
          ws.send(JSON.stringify({ error: "Invalid session code or link" }));
          return;
        }

        // Retrieve session details
        const sessionData = await redis.hgetall(`session:${sessionId}`);

        if (!sessionData || Date.now() > Number(sessionData.expiresAt)) {
          ws.send(JSON.stringify({ error: "Session expired or not found" }));
          return;
        }

        // Add receiver details to the session
        const receiverId = uuidv4();
        const receiverDetails = {
          id: receiverId,
          name,
          ip,
          joinedAt: Date.now(),
        };
        const receiversList = JSON.parse(sessionData.receiversDetails || "[]");
        receiversList.push(receiverDetails);

        await redis.hset(
          `session:${sessionId}`,
          "receiversDetails",
          JSON.stringify(receiversList)
        );

        // Notify the session creator (sender) about the new receiver
        const senderWs = sessions.get(sessionId);
        if (senderWs) {
          senderWs.send(
            JSON.stringify({
              type: "new-receiver",
              data: {
                sessionId,
                code: sessionCode,
                receiver: receiverDetails,
                receiverCount: receiversList.length,
              },
            })
          );
        }

        // Send session details back to the receiver
        ws.send(
          JSON.stringify({
            type: "session-joined",
            data: {
              sessionId,
              code: sessionCode,
              receiverId,
            },
          })
        );
      }

      // ✅ HANDLE OFFER
      if (type === "offer") {
        const { sessionId, offer, receiverId } = data;
        const senderWs = sessions.get(sessionId);

        if (!senderWs) {
          ws.send(JSON.stringify({ error: "Session not found" }));
          return;
        }

        senderWs.send(
          JSON.stringify({
            type: "offer",
            data: { offer, receiverId },
          })
        );
      }

      // ✅ HANDLE ANSWER
      if (type === "answer") {
        const { sessionId, answer, receiverId } = data;
        const senderWs = sessions.get(sessionId);

        if (!senderWs) {
          ws.send(JSON.stringify({ error: "Session not found" }));
          return;
        }

        senderWs.send(
          JSON.stringify({
            type: "answer",
            data: { answer, receiverId },
          })
        );
      }

      // ✅ HANDLE ICE CANDIDATE
      if (type === "ice-candidate") {
        const { sessionId, candidate, receiverId } = data;
        const senderWs = sessions.get(sessionId);

        if (!senderWs) {
          ws.send(JSON.stringify({ error: "Session not found" }));
          return;
        }

        senderWs.send(
          JSON.stringify({
            type: "ice-candidate",
            data: { candidate, receiverId,sessionId },
          })
        );
      }
    } catch (error) {
      console.error("❌ WebSocket error:", error);
    }
  });

  ws.on("close", () => {
    for (const [sessionId, connection] of sessions.entries()) {
      if (connection === ws) {
        console.log(`❌ Session ${sessionId} disconnected.`);
        sessions.delete(sessionId);
      }
    }
  });
});

console.log("🚀 WebSocket Server is running on ws://localhost:8080");
