import fs from 'fs';
import path from 'path';
import { getKeplerPath } from '../../main/util';

/**
 * It's getting the "code" parameter from a URL
 */
export function getAuthorizationCodeFromURL(url: string): string {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);

  const code = searchParams.get('code');
  if (!code) {
    throw new Error('Unable to retrieve code from URL');
  }

  return code;
}

export type UserData = {
  clientId: string;
  minecraftToken: string;
  profile: {
    id: string;
    name: string;
  };
};

export type MicrosoftAuthResponse =
  | { success: true; userData: UserData }
  | { success: false; userData?: undefined };

/**
 * It's writing a given userData object in the launcher data folder as userData.json
 */
export function writeUserData(userData: UserData): boolean {
  try {
    const keplerPath = getKeplerPath();
    if (!fs.existsSync(keplerPath)) {
      fs.mkdirSync(keplerPath);
    }

    const userDataFilename = path.join(keplerPath, 'userData.json');
    fs.writeFileSync(userDataFilename, JSON.stringify(userData));

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * It's processing microsoft authentication from Kepler API
 */
export async function processMicrosoftAuth(code: string): Promise<boolean> {
  const response = await fetch(
    `${process.env.API_HOSTNAME}/auth/microsoft/process-auth/${code}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  if (!response.ok)
    throw new Error(
      'An error has occured while trying to perform microsoft Authentication trough the API',
    );

  const json: MicrosoftAuthResponse = await response.json();
  if (!json.success)
    throw new Error(
      'An internal error has occured while trying to perform microsoft Authentication trough the API',
    );

  return writeUserData(json.userData);
}
