import { BrowserWindow, app, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import dotenv from 'dotenv';
import { resolveHtmlPath } from './util';
import handleCheckAuth from './handlers/auth-checker.handler';
import handleMicrosoftAuth from './handlers/microsoft-auth.handler';
import listenReadyToShow from './listeners/ready-to-show.listener';
import listenMinimize from './listeners/minimize.listener';
import listenClose from './listeners/close.listener';
import listenSetSize from './listeners/set-size.listener';
import getMicrosoftWindow from './windows/microsoft.window';
import getMainWindow from './windows/main.window';

dotenv.config();

const keplerPath = path.join(app.getPath('appData'), '.kepler');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let microsoftWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  /* if (isDebug) {
    await installExtensions();
  } */

  // It's importing the windows
  mainWindow = getMainWindow();
  microsoftWindow = getMicrosoftWindow();

  // It's loading base window
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // It's initializing listeners
  listenReadyToShow(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
    process.exit(0);
  });

  listenMinimize(ipcMain, mainWindow);
  listenClose(ipcMain);
  listenSetSize(ipcMain, mainWindow);

  // It's initializing handlers
  handleMicrosoftAuth(ipcMain, microsoftWindow);
  handleCheckAuth(ipcMain);

  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
