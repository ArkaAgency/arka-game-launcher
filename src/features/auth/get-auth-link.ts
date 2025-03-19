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
  return `${process.env.API_HOSTNAME}/auth/microsoft/auth-link`;
}
