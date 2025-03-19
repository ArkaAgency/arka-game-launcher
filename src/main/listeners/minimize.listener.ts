import { BrowserWindow } from 'electron';

export default function listenMinimize(
  ipcMain: any,
  mainWindow: BrowserWindow,
) {
  ipcMain.on('minimize', () => {
    mainWindow?.minimize();
  });
}
