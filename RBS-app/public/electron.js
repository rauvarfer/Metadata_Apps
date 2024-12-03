const { app, BrowserWindow, ipcMain } = require('electron'); // Importa ipcMain
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow () {
  const win = new BrowserWindow({
    width: 530,
    height: 750,
    webPreferences: {
      icon: path.join(__dirname, 'favicon.ico'),
      preload: path.join(__dirname, 'preload.js'), // Asegúrate de que el preload.js está bien cargado
      nodeIntegration: false,  // Cambiado a false por seguridad
      contextIsolation: true,  // Se habilita el context isolation
    }
  });

  win.loadURL(
    isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }

  // Escuchar el evento para minimizar y restaurar la ventana
  ipcMain.on('minimize-and-restore', () => {
    if (win) {
      win.blur();  // Minimizar la ventana
     // win.restore();
      win.focus(); // 
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
