import { BrowserWindow } from 'electron';
import getMicrosoftAuthLink from '../../features/auth/get-auth-link';
import {
  getAuthorizationCodeFromURL,
  processMicrosoftAuth,
} from '../../features/auth/process-microsoft-auth';

export default function handleMicrosoftAuth(
  ipcMain: any,
  microsoftWindow: BrowserWindow,
) {
  ipcMain.handle('microsoft-auth', async function ipcHandleMicrosoftAuth() {
    try {
      // It's getting microsoft auth link and opening it
      const microsoftLink = await getMicrosoftAuthLink();
      microsoftWindow?.loadURL(microsoftLink);
      microsoftWindow?.show();

      // It's waiting for user to connect trough Microsoft
      return new Promise((resolve) => {
        microsoftWindow?.webContents.on('did-navigate', async (event, url) => {
          if (url.includes(process.env.API_HOSTNAME || '')) {
            microsoftWindow?.hide();
            const code = getAuthorizationCodeFromURL(url);
            const authSuccess = await processMicrosoftAuth(code);
            resolve({
              success: authSuccess,
            });
          }
        });
      });
    } catch (error) {
      return { success: false, error };
    }
  });
}
