// utils/discovery.js
const dgram = require('dgram');

const PORT = 41234;
let socket = null;
let devices = {};

console.log("📡 Discovery module loaded");

function startDeviceDiscovery(onDeviceUpdate) {
  socket = dgram.createSocket('udp4');

  socket.on('message', (msg, rinfo) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'swoosh-discovery') {
        devices[data.id] = {
          name: data.name,
          ip: rinfo.address,
          lastSeen: Date.now(),
        };
        console.log(`👀 [Discovery] Found device: ${data.name} @ ${rinfo.address}`);
        onDeviceUpdate(Object.values(devices));
      }
    } catch (err) {
      console.error('❌ [Discovery] Invalid message received:', err.message);
    }
  });

  socket.bind(PORT, () => {
    socket.setBroadcast(true);
    console.log(`✅ [Discovery] Listening for devices on UDP port ${PORT}`);
  });

  // Prune stale devices
  setInterval(() => {
    const now = Date.now();
    const before = Object.keys(devices).length;

    devices = Object.fromEntries(
      Object.entries(devices).filter(([_, dev]) => now - dev.lastSeen < 15000)
    );

    const after = Object.keys(devices).length;
    if (before !== after) {
      console.log(`🧹 [Discovery] Cleaned up stale devices (${before - after} removed)`);
      onDeviceUpdate(Object.values(devices));
    }
  }, 8000);
}

function stopDeviceDiscovery() {
  if (socket) {
    socket.close();
    socket = null;
    console.log('🛑 [Discovery] Stopped listening for devices');
  }
}

module.exports = { startDeviceDiscovery, stopDeviceDiscovery };