import axios from 'axios';
import { getFileOrFolderPath, getUpdateState, setUpdateState } from '../config';
import * as fs from 'fs';
import { createHash } from 'crypto';

export default class GameUpdater {
    constructor() {
        this.filesToDownload = [];

        this.events = [];
        this.updateState = getUpdateState();
        this.globalProgress = 0;
    }

    async run() {
        // init
        let firstPassed = false;
        this.emit(Events.UpdateStateChange, 'loading');

        // it's checking java files
        const javaFiles = await getJavaFiles();
        if (!javaFiles.success) return alert('erreur a handler');
        this.createFolders(javaFiles.folders, 'java/');

        // it's checking game files
        const gameFiles = await getGameFiles();
        if (!gameFiles.success) return alert('erreur a handler');
        this.createFolders(gameFiles.folders);

        // it's checking mods files
        const modsFiles = await getModsFiles();
        if (!modsFiles.success) return alert('erreur a handler');
        this.createFolders(modsFiles.folders);

        // it's running java download / verification
        this.emit(Events.UpdateStateChange, 'checking');
        await this.processVerification(modsFiles.files, 'mods/remote/');
        await this.processVerification(javaFiles.files, 'java/');
        await this.processVerification(gameFiles.files);
        if (this.filesToDownload.length === 0) 
            firstPassed = true;

        if (!firstPassed) {
            // it's running the download process
            await this.processDownload();
            this.filesToDownload = [];

            // download finished, re-verify
            // it's running java download / verification
            this.emit(Events.UpdateStateChange, 'checking');
            await this.processVerification(modsFiles.files, 'mods/remote/');
            await this.processVerification(javaFiles.files, 'java/');
            await this.processVerification(gameFiles.files);

            // check files OK re download if needed
            if (this.filesToDownload > 0) {
                await this.processDownload();
            }
        }

        // allow client to run the game
        this.emit(Events.UpdateStateChange, 'ready');
        setUpdateState('hasBeenUpdated');
    }

    processDownload() {
        // eslint-disable-next-line
        return new Promise(async (resolve) => {
            // init state update
            this.emit(Events.UpdateStateChange, 'downloading');
            this.emit(Events.UpdateProgressChange, 0);

            // download files using downloadManager class
            const downloadManager = new DownloadManager(this.filesToDownload, 40);

            // update progress in UI on file download
            downloadManager.on('progress', (progressData) => {
                this.emit(Events.UpdateProgressChange, progressData.percentage);
            });

            // resolve when finished
            downloadManager.on('finished', () => {
                resolve();
            });

            // start download
            downloadManager.start();
        });
    }

    processVerification(files, prefix='') {
        return new Promise((resolve) => {
            files.forEach((file) => {
                const filename = getFileOrFolderPath(`${prefix}${file.filename}`);
                if (fs.existsSync(filename)) {
                    const fileBuffer = fs.readFileSync(filename);
                    const fileHash = createHash('md5').update(fileBuffer).digest('hex');
                    if (fileHash === file.md5) return;
                    fs.rmSync(filename);
                    this.filesToDownload.push({
                        ...file,
                        filename
                    });
                } else this.filesToDownload.push({
                    ...file,
                    filename
                });
            });
            resolve();
        });
    }

    createFolders(folders, prefix='') {
        if (!fs.existsSync(getFileOrFolderPath(prefix))) 
            fs.mkdirSync(getFileOrFolderPath(prefix));
        folders.forEach((folder) => {
            const folderPath = getFileOrFolderPath(`${prefix}${folder}`);
            if (!fs.existsSync(folderPath)) 
                fs.mkdirSync(folderPath);
        });
    }

    on(eventName, callback) {
        this.events = this.events.filter((e) => e.eventName !== eventName);
        this.events.push({
            eventName,
            callback
        });
        return 0;
    }

    emit(eventName, eventData) {
        this.events.forEach((e) => {
            if (e.eventName === eventName) {
                e.callback(eventData);
            }
        });
    }
}

class DownloadManager {
    constructor(files, slotsNumber=20) {
        this.files = files;
        this.totalFiles = files.length;
        this.remaingFiles = files.length;
        this.slots = [];
        this.slotsNumber = slotsNumber;
        this.events = [];
    }

    start() {
        for (let i = 0; i < this.slotsNumber; i++) {
            const newSlotFile = this.files.shift();
            const slot = new DownloadSlot();
            slot.on('complete', () => {
                this.onSlotComplete(slot);
            });
            slot.assignAndStart(newSlotFile);
            this.slots.push(slot);
        }
    }

    onSlotComplete(slot) {
        this.remaingFiles--;
        this.emit('progress', {
            percentage: Math.round(((this.totalFiles - this.remaingFiles) / this.totalFiles) * 100) || 0
        });
        if (this.remaingFiles === 0) return this.emit('finished', null);
        const newSlotFile = this.files.shift();
        slot.assignAndStart(newSlotFile);
    }

    on(eventName, callback) {
        this.events = this.events.filter((e) => e.eventName !== eventName);
        this.events.push({
            eventName,
            callback
        });
        return 0;
    }

    emit(eventName, eventData) {
        this.events.forEach((e) => {
            if (e.eventName === eventName) {
                e.callback(eventData);
            }
        });
    }
}

class DownloadSlot{
    constructor() {
        this.events = [];
    }

    async assignAndStart(file) {
        if (file === undefined) this.emit('complete', null);
        // getting vars from the object
        const {filename, downloadLink} = file;

        // downloading file
        const downloadedFile = await axios.get(downloadLink, {
            responseType: 'arraybuffer'
        }).catch((err) => {
            console.error('ERROR WHILE DOWNLOADING FILE', err);
        });

        // copying file data
        const fileBuffer = Buffer.from(downloadedFile.data, 'binary');
        fs.writeFileSync(filename, fileBuffer);

        // slot complete event
        this.emit('complete', null);
    }

    on(eventName, callback) {
        this.events = this.events.filter((e) => e.eventName !== eventName);
        this.events.push({
            eventName,
            callback
        });
        return 0;
    }

    emit(eventName, eventData) {
        this.events.forEach((e) => {
            if (e.eventName === eventName) {
                e.callback(eventData);
            }
        });
    }
}

const Events = {
    UpdateStateChange: 'updateStateChange',
    UpdateProgressChange: 'updateProgressChange',
};

function getJavaFiles() {
    return new Promise((resolve) => {
        axios.get('https://api.modded.arka-group.io/update/java/windows_x64')
            .then((res) => res.data)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                resolve({
                    success: false
                });
                throw err;
            });
    });
}

function getGameFiles() {
    return new Promise((resolve) => {
        axios.get('https://api.modded.arka-group.io/update/game')
            .then((res) => res.data)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                resolve({
                    success: false
                });
                throw err;
            });
    });
}

function getModsFiles() {
    return new Promise((resolve) => {
        axios.get('https://api.modded.arka-group.io/update/mods')
            .then((res) => res.data)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                resolve({
                    success: false
                });
                throw err;
            });
    });
}