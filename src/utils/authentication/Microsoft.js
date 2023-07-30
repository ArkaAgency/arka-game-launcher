const request = require('request');

module.exports = {
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
                            
                            this.getMinecraftProfile(minecraftToken).then((minecraftProfileRes) => {

                                resolve({
                                    success: true,
                                    data: {
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