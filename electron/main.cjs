const { app, BrowserWindow } = require("electron");
const path = require("path");

const { startDeviceDiscovery } = require("./utils/discovery.cjs");
const { startBroadcastingSelf } = require("./utils/broadcast.cjs");

let win;

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

  win.webContents.on("console-message", (e, level, message, line, sourceId) => {
    if (message.includes("Autofill")) {
      e.preventDefault(); // 🚫 block autofill logs
    }
  });

  // Important: this must run after the window is ready
  win.webContents.on("did-finish-load", () => {
    startDeviceDiscovery((devices) => {
      win.webContents.send("devices", devices);
    });

    startBroadcastingSelf();
  });
}

app.whenReady().then(createWindow);
