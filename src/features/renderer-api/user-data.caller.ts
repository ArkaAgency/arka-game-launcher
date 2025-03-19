import { UserData } from '../auth/process-microsoft-auth';

export default function renderGetUserData(): Promise<UserData | null> {
  return window.electron.ipcRenderer.invoke('get-user-data');
}
