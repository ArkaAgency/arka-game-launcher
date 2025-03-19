type MicrosoftAuthLinkResponse =
  | {
      success: false;
      authURL?: string;
    }
  | {
      success: true;
      authURL: string;
    };

/**
 * It's getting microsoft oauth link from kepler studio api
 */
export default async function getMicrosoftAuthLink(): Promise<string> {
  const response = await fetch(
    `${process.env.API_HOSTNAME}/auth/microsoft/auth-link`,
  );

  if (!response.ok)
    throw new Error(
      'An error has occured while trying to get the microsoft auth link',
    );

  const json: MicrosoftAuthLinkResponse = await response.json();

  if (json.success) {
    return json.authURL;
  }

  throw new Error(
    'An error has occured while trying to get the microsoft auth link',
  );
}
