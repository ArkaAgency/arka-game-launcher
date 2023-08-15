import * as rpc from 'discord-rpc';
import config from '../configs/rpc.json';

export default class ArkaDiscordRichPresence {
    constructor() {
        this.details = config.Details;
        this.state = config.State;
        this.start = Date.now();
        this.client = new rpc.Client({ transport: 'ipc' });
        this.client.login({
            clientId: config.ClientID
        }).catch((err) => {
            console.error('Launcher => Error while connecting to Discord RPC', err);
        });
        this.client.on('ready', () => {
            this.updateRPC();
        });
    }

    setDetails(details) {
        this.details = details;
        this.updateRPC();
    }

    setState(state) {
        this.state = state;
        this.updateRPC();
    }

    updateRPC() {
        this.client.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: {
                details: this.details,
                state: this.state,
                timestamps: {
                    start: this.start
                },
                assets: {
                    large_image: config.LargeImage,
                    large_text: config.LargeImageText,
                },
            }
        });
    }
}