export default function rendererIsAuthenticated(): Promise<boolean> {
  return window.electron.ipcRenderer.invoke('check-auth');
}
