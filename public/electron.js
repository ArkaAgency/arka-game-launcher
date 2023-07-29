const electron = require('electron');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let mainWindow;

/**
 * Instantiate the main window
 * @date 7/29/2023 - 2:46:44 PM
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 440,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        },
        frame: false,
        icon: __dirname + '/icon.png',
        resizable: false
    });
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
}

/**
 * It's creating the ipc protocol handlers
 * @date 7/29/2023 - 2:45:34 PM
 */
function listenIpc() {
    // minimize window
    ipc.on('minimize', () => {
        mainWindow.minimize();
    });
    
    // close app
    ipc.on('close', () => {
        mainWindow.close();
    });
    
    // hide app
    ipc.on('hide', () => {
        mainWindow.hide();
    });
    
    // show app
    ipc.on('show', () => {
        mainWindow.show();
    });

    // display full size window
    ipc.on('main', () => {
        mainWindow.setSize(1200, 690);
    });

    // display small size window
    ipc.on('default', () => {
        mainWindow.setSize(440, 600);
    });
}

// waiting for app to be ready to create window and listen to the ipc protocol
app.on('ready', createWindow);
app.on('ready', listenIpc);
