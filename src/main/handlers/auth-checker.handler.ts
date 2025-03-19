import { isAuthenticated } from '../../features/auth/auth-checker';

export default function handleCheckAuth(ipcMain: any) {
  ipcMain.handle('check-auth', () => {
    const status = isAuthenticated();
    return status;
  });
}
