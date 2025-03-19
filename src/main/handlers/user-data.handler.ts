import path from 'path';
import fs from 'fs';
import { getKeplerPath } from '../util';
import { UserData } from '../../features/auth/process-microsoft-auth';
import { isUserDataValid } from '../../features/auth/auth-checker';

export default function handleGetUserData(ipcMain: any) {
  ipcMain.handle('get-user-data', (): UserData | null => {
    // It's checking if data files are presents
    const keplerPath = getKeplerPath();
    const userDataFilename = path.join(keplerPath, 'userData.json');
    if (!fs.existsSync(keplerPath) || !fs.existsSync(userDataFilename))
      return null;

    // It's importing user data and checking if it is valid or not
    const userDataBuffer = fs.readFileSync(userDataFilename).toString();
    const userData = JSON.parse(userDataBuffer);
    if (!isUserDataValid(userData)) return null;

    // It's returning user data
    return userData;
  });
}
