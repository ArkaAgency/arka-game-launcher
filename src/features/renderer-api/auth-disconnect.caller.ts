export default function rendererAuthDisconnect(): Promise<boolean> {
  return window.electron.ipcRenderer.invoke('auth-disconnect');
}
