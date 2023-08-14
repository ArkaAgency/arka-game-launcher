const electron = require('electron');
const path = require('path');
const remote = require('@electron/remote/main');
const request = require('request');
const dotenv = require('dotenv');
const log = require('electron-log');
const {autoUpdater} = require('electron-updater');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
remote.initialize();
dotenv.config();

let mainWindow;
let authWindow;

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const microsoft = {
    getAuthorizationURL(clientId, redirectUri){
        return `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&redirect_uri=${redirectUri}&scope=XboxLive.signin%20offline_access&state=NOT_NEEDED&response_type=code&cobrandid=8058f65d-ce06-4c30-9559-473c9275a65d`;
    },

    processFullAuth(clientId, clientSecret, redirectUri, code) {
        return new Promise((resolve) => {
            this.getToken(clientId, clientSecret, code, redirectUri).then((getTokenRes) => {

                const microsoftAccessToken = getTokenRes.access_token;

                this.authenticate(microsoftAccessToken).then((xboxLoginRes) => {

                    const xboxLiveToken = xboxLoginRes.Token;
                    const xboxLiveUHS = xboxLoginRes.DisplayClaims.xui[0].uhs;

                    this.getXstsToken(xboxLiveToken).then((xstsTokenRes) => {

                        const xstsToken = xstsTokenRes.Token;

                        this.getMinecraftToken(xboxLiveUHS, xstsToken).then((minecraftTokenRes) => {

                            const minecraftToken = minecraftTokenRes.access_token;
                            
                            this.getMinecraftOwnership(minecraftToken).then((minecraftOwnership) => {

                                const hasMinecraftJavaEdition = minecraftOwnership.items.some((item) => item.name === 'game_minecraft');
                                if (!hasMinecraftJavaEdition) return resolve({
                                    success: false,
                                    error: {
                                        message: {
                                            en: 'You dont own Minecraft: Java Edition!',
                                            fr: 'Vous ne possedez pas Minecraft: Java Edition!'
                                        },
                                        stack: 'minecraft owner ships is not passed'
                                    }
                                });

                                const minecraftItem = minecraftOwnership.items.find((item) => item.name === 'game_minecraft');
                                const minecraftItemDecoded = parseJwt(minecraftItem.signature);
                                const clientId = minecraftItemDecoded.signerId;

                                this.getMinecraftProfile(minecraftToken).then((minecraftProfileRes) => {

                                    resolve({
                                        success: true,
                                        data: {
                                            clientId,
                                            minecraftToken,
                                            profile: {
                                                id: minecraftProfileRes.id,
                                                name: minecraftProfileRes.name
                                            }
                                        }
                                    });
    
                                }).catch((err) => {
                                    resolve({
                                        success: false,
                                        error: {
                                            message: {
                                                en: '',
                                                fr: ''
                                            },
                                            stack: err
                                        }
                                    });
                                });

                            });

                        }).catch((err) => {
                            resolve({
                                success: false,
                                error: {
                                    message: {
                                        en: '',
                                        fr: ''
                                    },
                                    stack: err
                                }
                            });
                        });

                    }).catch((err) => {
                        resolve({
                            success: false,
                            error: {
                                message: {
                                    en: '',
                                    fr: ''
                                },
                                stack: err
                            }
                        });
                    });

                }).catch((err) => {
                    resolve({
                        success: false,
                        error: {
                            message: {
                                en: '',
                                fr: ''
                            },
                            stack: err
                        }
                    });
                });

            }).catch((err) => {
                resolve({
                    success: false,
                    error: {
                        message: {
                            en: '',
                            fr: ''
                        },
                        stack: err
                    }
                });
            });
        });
    },

    getToken (clientId, clientSecret, code, redirectUri) {
        const url = 'https://login.live.com/oauth20_token.srf';
      
        return new Promise((resolve, reject) => {
            request({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                form: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code'
                },
                json: true
            }, (err, res, body) => {
                if(err) reject(err);
      
                resolve(body);
            });
        });
    },

    authenticate(accessToken) {
        const url = 'https://user.auth.xboxlive.com/user/authenticate';
        
        return new Promise((resolve, reject) => {
            request({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: {
                    Properties: {
                        AuthMethod: 'RPS',
                        SiteName: 'user.auth.xboxlive.com',
                        RpsTicket: `d=${accessToken}`
                    },
                    RelyingParty: 'http://auth.xboxlive.com',
                    TokenType: 'JWT'
                },
                json: true
            }, (err, res, body) => {
                if(err) reject(err);
      
                resolve(body);
            });
        });
    },

    getXstsToken(accessToken) {
        const url = 'https://xsts.auth.xboxlive.com/xsts/authorize';
        
        return new Promise((resolve, reject) => {
            request({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: {
                    Properties: {
                        SandboxId: 'RETAIL',
                        UserTokens: [
                            accessToken
                        ]
                    },
                    RelyingParty: 'rp://api.minecraftservices.com/',
                    TokenType: 'JWT'
                },
                json: true
            }, (err, res, body) => {
                if(err) reject(err);
      
                resolve(body);
            });
        });
    },

    getMinecraftToken (userHash, xstsToken) {
        const url = 'https://api.minecraftservices.com/authentication/login_with_xbox';
  
        return new Promise((resolve, reject) => {
            request({
                url,
                method: 'POST',
                body: {
                    identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
                    ensureLegacyEnabled: true
                },
                json: true
            }, (err, res, body) => {
                if(err) reject(err);

                resolve(body);
            });
        });
    },

    getMinecraftOwnership (token) {
        const url = 'https://api.minecraftservices.com/entitlements/mcstore';
  
        return new Promise((resolve, reject) => {
            request({
                url,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                json: true
            }, (err, res, body) => {
                if(err) reject(err);
      
                resolve(body);
            });
        });
    },

    getMinecraftProfile (token) {
        const url = 'https://api.minecraftservices.com/minecraft/profile';
  
        return new Promise((resolve, reject) => {
            request({
                url,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                json: true
            }, (err, res, body) => {
                if(err) reject(err);
      
                resolve(body);
            });
        });
    }
};

/**
 * Instantiate the main window
 * @date 7/29/2023 - 2:46:44 PM
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 420,
        height: 420,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            devTools: true,
            allowRunningInsecureContent: true
        },
        frame: false,
        icon: path.join(__dirname, '/Icon_Alone_Transparent.png'),
        resizable: false,
    });
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    remote.enable(mainWindow.webContents);
}

/**
 * Instantiate the microsoft login window
 * @date 7/30/2023 - 6:01:38 AM
 */
function createMicrosoftWindow() {
    authWindow = new BrowserWindow({
        width: 800,
        height: 650,
        resizable: false,
        autoHideMenuBar: true,
        fullscreenable: false,
        backgroundColor: 'black',
        movable: false,
        minimizable: false,
        closable: true,
        frame: true,
        icon: path.join(__dirname, '/Icon_Alone_Transparent.png'),
        webPreferences: {
            devTools: true,
            nodeIntegration: false,
            contextIsolation: false,
        }
    });
    authWindow.loadURL(microsoft.getAuthorizationURL(process.env.MICROSOFT_CLIENT_ID, process.env.MICROSOFT_REDIRECT_URI));
    remote.enable(authWindow.webContents);
}

/**
 * It's creating the ipc protocol handlers
 * @date 7/29/2023 - 2:45:34 PM
 */
async function listenIpc() {
    // minimize window
    ipc.handle('minimize', () => {
        mainWindow.minimize();
    });
    
    // close app
    ipc.handle('close', () => {
        mainWindow.close();
    });
    
    // hide app
    ipc.handle('hide', () => {
        mainWindow.hide();
    });
    
    // show app
    ipc.handle('show', () => {
        mainWindow.show();
    });

    // display full size window
    ipc.handle('main', () => {
        mainWindow.setSize(1200, 690);
        mainWindow.center();
    });

    // display small size window
    ipc.handle('default', () => {
        mainWindow.setSize(420, 420);
        mainWindow.center();
    });

    // open microsoft auth window
    ipc.handle('login.microsoft.open', async () => {
        createMicrosoftWindow();
        authWindow.center();

        // it's handling the window navigation event
        authWindow.webContents.on('did-navigate', async () => {
            // it's checking for redirect URL
            const url = authWindow.webContents.getURL();
            if (!url.startsWith(process.env.MICROSOFT_REDIRECT_URI)) return;

            // it's getting the auth code from URL
            const parsedUrl = url.replace(process.env.MICROSOFT_REDIRECT_URI, '');
            const urlParams = new URLSearchParams(parsedUrl);
            const code = urlParams.get('code');

            // it's launching the auth process
            authWindow.hide();
            const authResults = await microsoft.processFullAuth(
                process.env.MICROSOFT_CLIENT_ID, 
                process.env.MICROSOFT_CLIENT_SECRET, 
                process.env.MICROSOFT_REDIRECT_URI,
                code
            );
            
            // it's handling the auth results
            if (authResults.success) {
                // it's clearing the window and returning the auth data to the renderer process
                authWindow = null;
                mainWindow.webContents.send('login.microsoft.success', authResults.data);
            } else {
                // it's sending the error to the renderer process
                mainWindow.webContents.send('login.microsoft.error', authResults.err);
            }
        });

        // it's handling unknown close reason
        authWindow.webContents.on('close', () => {
            console.log('close');
            mainWindow.webContents.send('login.microsoft.error', {
                message: {
                    en: 'An unknown error has ocurred while performing Microsoft authentication.',
                    fr: 'Une erreur inconnue est survenue lors de l\'identification a Microsoft.'
                }
            });
        });
    });

    // handle user disconnect
    ipc.handle('disconnect', () => {
        mainWindow.hide();
        const session = mainWindow.webContents.session;
        session.clearCache();
        if (authWindow) {
            const session2 = authWindow.webContents.session;
            session2.clearCache();
        }
        createWindow();
    });

    /*
            update system
        */

    ipc.handle('check-for-updates', () => {
        autoUpdater.checkForUpdatesAndNotify();
        autoUpdater.autoInstallOnAppQuit = true;
    
        autoUpdater.on('checking-for-update', () => {
            mainWindow.webContents.send('update.checking');
        });
        autoUpdater.on('update-available', (info) => {
            log.info(info);
            mainWindow.webContents.send('update.results.isAvailable');
            autoUpdater.downloadUpdate();
        });
        autoUpdater.on('update-not-available', (info) => {
            log.info(info);
            mainWindow.webContents.send('update.results.isUpToDate');
        });
        autoUpdater.on('error', (err) => {
            mainWindow.webContents.send('update.results.error', err);
        });
        autoUpdater.on('download-progress', (progressObj) => {
            log.info(progressObj);
            mainWindow.webContents.send('update.download.infos', {
                status: 'downloading',
                percentage: progressObj.percent,
                speed: progressObj.bytesPerSecond,
                done: progressObj.transferred,
                total: progressObj.total,
                progressObj
            });
        });
        autoUpdater.on('update-downloaded', () => {
            const dialogOpts = {
                type: 'info',
                buttons: ['Redemarrer', 'Plus tard'],
                title: 'Mise a jour du Launcher',
                message: 'Yeah!!',
                detail:
                  'Une nouvelle version a ete telechargee, redemarrez l\'application pour appliquer les changements.'
            };
            
            electron.dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) autoUpdater.quitAndInstall();
                if (returnValue.response === 0) mainWindow.webContents.send('update.install');
                mainWindow.webContents.send('update.done');
            });
        });
    });
}

// waiting for app to be ready to create window and listen to the ipc protocol
app.on('ready', () => {
    createWindow();
});
app.on('ready', async () => listenIpc());
// it's handling app closure
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
