const electron = require('electron');
const path = require('path');
const remote = require('@electron/remote/main');
const microsoft = require('../src/utils/authentication/Microsoft');
const dotenv = require('dotenv');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
remote.initialize();
dotenv.config();

let mainWindow;
let authWindow;

/**
 * Instantiate the main window
 * @date 7/29/2023 - 2:46:44 PM
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 420,
        height: 420,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            devTools: true,
            allowRunningInsecureContent: true
        },
        frame: false,
        icon: path.join(__dirname, '/icon.png'),
        resizable: false,
    });
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    remote.enable(mainWindow.webContents);
}


/**
 * Instantiate the microsoft login window
 * @date 7/30/2023 - 6:01:38 AM
 */
function createMicrosoftWindow() {
    authWindow = new BrowserWindow({
        width: 800,
        height: 650,
        resizable: false,
        autoHideMenuBar: true,
        fullscreenable: false,
        backgroundColor: 'black',
        movable: false,
        minimizable: false,
        closable: true,
        frame: true,
        icon: path.join(__dirname, '/icon.png'),
        webPreferences: {
            devTools: true,
            nodeIntegration: false,
            contextIsolation: false,
        }
    });
    authWindow.loadURL(microsoft.getAuthorizationURL(process.env.MICROSOFT_CLIENT_ID, process.env.MICROSOFT_REDIRECT_URI));
    remote.enable(authWindow.webContents);
}

/**
 * It's creating the ipc protocol handlers
 * @date 7/29/2023 - 2:45:34 PM
 */
async function listenIpc() {
    // minimize window
    ipc.handle('minimize', () => {
        mainWindow.minimize();
    });
    
    // close app
    ipc.handle('close', () => {
        mainWindow.close();
    });
    
    // hide app
    ipc.handle('hide', () => {
        mainWindow.hide();
    });
    
    // show app
    ipc.handle('show', () => {
        mainWindow.show();
    });

    // display full size window
    ipc.handle('main', () => {
        mainWindow.setSize(1200, 690);
    });

    // display small size window
    ipc.handle('default', () => {
        mainWindow.setSize(420, 420);
    });

    // open microsoft auth window
    ipc.handle('login.microsoft.open', async () => {
        createMicrosoftWindow();

        // it's handling the window navigation event
        authWindow.webContents.on('did-navigate', async () => {
            // it's checking for redirect URL
            const url = authWindow.webContents.getURL();
            if (!url.startsWith(process.env.MICROSOFT_REDIRECT_URI)) return;

            // it's getting the auth code from URL
            const parsedUrl = url.replace(process.env.MICROSOFT_REDIRECT_URI, '');
            const urlParams = new URLSearchParams(parsedUrl);
            const code = urlParams.get('code');

            // it's launching the auth process
            authWindow.hide();
            const authResults = await microsoft.processFullAuth(
                process.env.MICROSOFT_CLIENT_ID, 
                process.env.MICROSOFT_CLIENT_SECRET, 
                process.env.MICROSOFT_REDIRECT_URI,
                code
            );
            
            // it's handling the auth results
            if (authResults.success) {
                // it's clearing the window and returning the auth data to the renderer process
                authWindow = null;
                mainWindow.webContents.send('login.microsoft.success', authResults.data);
            } else {
                // it's sending the error to the renderer process
                mainWindow.webContents.send('login.microsoft.error', authResults.err);
            }
        });

        // it's handling unknown close reason
        authWindow.webContents.on('close', () => {
            console.log('close');
            mainWindow.webContents.send('login.microsoft.error', {
                message: {
                    en: 'An unknown error has ocurred while performing Microsoft authentication.',
                    fr: 'Une erreur inconnue est survenue lors de l\'identification a Microsoft.'
                }
            });
        });
    });
}

// waiting for app to be ready to create window and listen to the ipc protocol
app.on('ready', createWindow);
app.on('ready', async () => listenIpc());

// it's handling app closure
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
