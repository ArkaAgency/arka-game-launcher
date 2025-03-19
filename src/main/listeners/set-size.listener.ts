import { BrowserWindow } from 'electron';

export default function listenSetSize(ipcMain: any, mainWindow: BrowserWindow) {
  ipcMain.on('set-size', (event, size) => {
    mainWindow?.setSize(size.w, size.h);
  });
}
