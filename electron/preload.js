// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("swoosh", {
  onDevicesUpdated: (callback) => {
    ipcRenderer.on("devices", (_, devices) => callback(devices));
  },
   onSelfDevice: (callback) => {
    ipcRenderer.on("self-device", (_, info) => callback(info));
  }
});