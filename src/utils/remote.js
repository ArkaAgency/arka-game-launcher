import * as remote from '@electron/remote';


/**
 * It's initializing the electron remote plugin
 * @date 7/30/2023 - 5:06:01 AM
 *
 * @export
 */
export function initialize() {
    const window = new remote.BrowserWindow({
        width: 440,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            devTools: true,
            allowRunningInsecureContent: true
        },
        frame: false,
        icon: './icon.png',
        resizable: false,
    });

    // note we call `require` on `remote` here
    const remoteMain = remote.require('@electron/remote/main');
    remoteMain.enable(window.webContents);
}
