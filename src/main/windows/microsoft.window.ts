import { BrowserWindow } from 'electron';
import { getAssetPath } from '../util';

export default function getMicrosoftWindow(): BrowserWindow {
  return new BrowserWindow({
    show: false,
    width: 480,
    height: 720,
    titleBarStyle: 'hiddenInset',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: false,
    },
  });
}
