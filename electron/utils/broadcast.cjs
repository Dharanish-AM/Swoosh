// utils/broadcaster.js
const dgram = require('dgram');
const os = require('os');

const PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';
let socket = null;

function getDeviceId() {
  return `${os.hostname()}-${Date.now()}`;
}

const deviceId = getDeviceId();
const hostname = os.hostname();

console.log("🔊 Broadcasting module loaded")

function startBroadcastingSelf() {
  socket = dgram.createSocket('udp4');

  socket.bind(() => {
    socket.setBroadcast(true);
    console.log(`✅ [Broadcaster] Started broadcasting as "${hostname}"`);
  });

  setInterval(() => {
    const payload = {
      type: 'swoosh-discovery',
      name: hostname,
      id: deviceId,
    };
    const message = Buffer.from(JSON.stringify(payload));

    socket.send(message, 0, message.length, PORT, BROADCAST_ADDR, (err) => {
      if (err) {
        console.error('❌ [Broadcaster] Error sending broadcast:', err.message);
      } else {
        console.log(`📡 [Broadcaster] Broadcast sent: ${JSON.stringify(payload)}`);
      }
    });
  }, 5000); // every 5 seconds
}

function stopBroadcastingSelf() {
  if (socket) {
    socket.close();
    socket = null;
    console.log('🛑 [Broadcaster] Stopped broadcasting');
  }
}

module.exports = { startBroadcastingSelf, stopBroadcastingSelf };