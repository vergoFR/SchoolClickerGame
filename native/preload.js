const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveGame: (saveData) => ipcRenderer.invoke('save-game', saveData),
  loadGame: () => ipcRenderer.invoke('load-game'),
  onMenuSave: (callback) => ipcRenderer.on('menu-save', callback),
  onMenuLoad: (callback) => ipcRenderer.on('menu-load', callback)
});