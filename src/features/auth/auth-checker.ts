import fs from 'fs';
import path from 'path';
import { getKeplerPath } from '../../main/util';
import { UserData } from './process-microsoft-auth';

/**
 * It's checking the schema of a UserData json object
 */
export function isUserDataValid(userData: UserData) {
  return (
    typeof userData === 'object' &&
    userData !== null &&
    typeof userData.clientId === 'string' &&
    typeof userData.minecraftToken === 'string' &&
    typeof userData.profile === 'object' &&
    userData.profile !== null &&
    typeof userData.profile.id === 'string' &&
    typeof userData.profile.name === 'string'
  );
}

/**
 * It's deleting user data file
 */
export function deleteUserData() {
  const keplerPath = getKeplerPath();
  const userDataFilename = path.join(keplerPath, 'userData.json');
  if (!fs.existsSync(userDataFilename)) return;
  fs.unlinkSync(userDataFilename);
}

/**
 * It's returning a boolean depending on the user authentication state
 */
export function isAuthenticated() {
  try {
    // It's checking that the launcher data dir exists
    const keplerPath = getKeplerPath();
    if (!fs.existsSync(keplerPath)) return false;

    // It's checking that the user data file exists
    const userDataFilename = path.join(keplerPath, 'userData.json');
    if (!fs.existsSync(userDataFilename)) return false;

    // It's reading user data and checking if it is valid
    const userDataBuffer = fs.readFileSync(userDataFilename).toString();
    const userData: UserData = JSON.parse(userDataBuffer);
    if (!isUserDataValid(userData)) {
      // It's deleting user data file cause it is not valid
      deleteUserData();
      return false;
    }

    // It's returning true cause everything is fine
    return true;
  } catch (err) {
    return false;
  }
}
