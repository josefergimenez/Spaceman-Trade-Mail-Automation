const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getData: () => ipcRenderer.invoke('database-connection'),
    // Puedes exponer más funciones según sea necesario
});


