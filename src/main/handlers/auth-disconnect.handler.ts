import { deleteUserData } from '../../features/auth/auth-checker';

export default function handleAuthDisconnect(ipcMain: any) {
  ipcMain.handle('auth-disconnect', () => {
    deleteUserData();
    return true;
  });
}
