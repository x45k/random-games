// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    // Load the index.html file into the window
    win.loadFile('index.html');

    // Open DevTools for debugging (optional)
    // win.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    // Create a new window if there are no windows open when the app is activated
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit the application when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
