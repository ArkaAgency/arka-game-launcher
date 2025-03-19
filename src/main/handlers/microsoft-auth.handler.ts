import { BrowserWindow } from 'electron';
import getMicrosoftAuthLink from '../../features/auth/get-auth-link';
import {
  MicrosoftAuthResponse,
  writeUserData,
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
        microsoftWindow?.webContents.on('did-finish-load', async () => {
          const currentUrl = microsoftWindow.webContents.getURL();
          if (
            currentUrl.startsWith(process.env.API_HOSTNAME as string) &&
            currentUrl.includes('process-auth')
          ) {
            microsoftWindow?.hide();
            microsoftWindow.webContents
              .executeJavaScript('document.querySelector("body").innerText')
              .then((pageContent) => {
                try {
                  const jsonData: MicrosoftAuthResponse =
                    JSON.parse(pageContent);
                  if (jsonData.success) {
                    writeUserData(jsonData.userData);
                    resolve({ success: true });
                  }
                } catch (error) {
                  console.error('Erreur lors du parsing JSON', error);
                }
                return pageContent;
              })
              .catch((err) => {
                return err;
              });
          }
        });
      });
    } catch (error) {
      return { success: false, error };
    }
  });
}
