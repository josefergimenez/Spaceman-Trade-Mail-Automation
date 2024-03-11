const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getData: (from1, to1, from2, to2) => ipcRenderer.invoke('database-connection', { from1, to1, from2, to2 }),
});
