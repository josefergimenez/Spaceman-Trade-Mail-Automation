const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { DataSource } = require('typeorm');
const { main } = require('./calculos')
const fs = require('fs');

let mainWindow

function mainProcess() {
    const win = new BrowserWindow()
    win.webContents.openDevTools()
    createWindow();
    app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  import('electron-is-dev').then(isDev => {
    const startURL = isDev.default
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow.loadURL(startURL);

   
  }).catch(error => {
    console.error('Error loading electron-is-dev:', error);
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', mainProcess);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.handle('database-connection', async () => {
    
    const DATABASE_URL = 'postgres://uzqhyrix:4hqkhucfrgKVd1LywjfXNYLPaDQBhojX@lallah.db.elephantsql.com/uzqhyrix';
    // Configuración de la fuente de datos fuera de la función
    const AppDataSource = new DataSource({
        type: 'postgres',
        url: DATABASE_URL,
    });

    try {
        await AppDataSource.initialize();
        console.log("Connection to the database has been established successfully.");
        return main(AppDataSource); // Cambiado para devolver un booleano indicando éxito
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return error.message; // Cambiado para devolver un booleano indicando fracaso
    }
}); 
