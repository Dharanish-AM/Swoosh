const { app, BrowserWindow } = require("electron");
const path = require("path");

const { startDeviceDiscovery } = require("./utils/discovery.cjs");
const { startBroadcastingSelf } = require("./utils/broadcast.cjs");

let win;
let knownDevices = [];

function getDeviceInfo() {
  const hostname = os.hostname();
  const localIp = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

  return { hostname, ip: localIp };
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");

  // ⛔ Suppress Autofill noise from DevTools
  win.webContents.on("console-message", (e, level, message, line, sourceId) => {
    if (message.includes("Autofill")) {
      e.preventDefault();
    }
  });

  // ✅ Send cached devices once React UI finishes loading
  win.webContents.on("did-finish-load", () => {
    if (knownDevices.length) {
      win.webContents.send("devices", knownDevices);
    }
  });

  // ✅ Start discovery and broadcasting *immediately*
  startDeviceDiscovery((devices) => {
    knownDevices = devices;
    if (win && win.webContents) {
      win.webContents.send("devices", devices);
    }
  });

  startBroadcastingSelf();
}

app.whenReady().then(createWindow);
