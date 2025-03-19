import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getAssetPath } from '../util';

export default function getMainWindow(): BrowserWindow {
  return new BrowserWindow({
    show: false,
    width: 620,
    height: 820,
    titleBarStyle: 'hidden',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, '../preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
      devTools: true,
    },
  });
}
