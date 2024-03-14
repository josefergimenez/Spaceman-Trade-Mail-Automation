const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getData: (from1, to1, from2, to2, from12, to12, from22, to22 ) => ipcRenderer.invoke('database-connection', { from1, to1, from2, to2, from12, to12, from22, to22 }),
});
