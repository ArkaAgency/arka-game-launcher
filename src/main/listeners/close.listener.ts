export default function listenClose(ipcMain: any) {
  ipcMain.on('close', () => {
    process.exit(0);
  });
}
