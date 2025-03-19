import { BrowserWindow } from 'electron';

export default function listenSetWindowMaximised(
  ipcMain: any,
  mainWindow: BrowserWindow,
) {
  ipcMain.on('set-window-maximised', (event: any, isMaximised: boolean) => {
    if (isMaximised) {
      mainWindow.maximize();
    } else {
      mainWindow.unmaximize();
    }
  });
}
