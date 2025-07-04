const dgram = require('dgram');
const os = require("os");

const PORT = 41234;
let socket = null;
let devices = {};

console.log("📡 Discovery module loaded");

const localIPs = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface.family === "IPv4" && !iface.internal)
  .map((iface) => iface.address);


function startDeviceDiscovery(onDeviceUpdate) {
  socket = dgram.createSocket('udp4');

  socket.on('message', (msg, rinfo) => {
    try {
      const data = JSON.parse(msg.toString());

      // ✅ Ignore self device based on local IP
      if (localIPs.includes(rinfo.address)) return;

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

}

function stopDeviceDiscovery() {
  if (socket) {
    socket.close();
    socket = null;
    console.log('🛑 [Discovery] Stopped listening for devices');
  }
}

module.exports = { startDeviceDiscovery, stopDeviceDiscovery };