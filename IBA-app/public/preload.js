const { contextBridge, ipcRenderer } = require('electron');

// Exponemos una API segura al frontend
contextBridge.exposeInMainWorld('electron', {
    minimizeAndRestore: () => {
        ipcRenderer.send('minimize-and-restore');
    }
});
