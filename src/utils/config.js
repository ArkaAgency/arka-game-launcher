import * as fs from 'fs';
import getAppDataPath from 'appdata-path';
import path from 'path';
import defaultConfig from './../configs/default.json';

let config = null;

function _init() {
    // it's creating default MODDED_S1 folders
    const appdata = getAppDataPath('.arkamodded');

    if (!fs.existsSync(appdata)) 
        fs.mkdirSync(appdata);

    const subfolders = [
        'mods', 'mods/local', 'mods/remote', 'mods/remote/required', 'mods/remote/optionnals', 'mods/remote/performances'
    ];
    subfolders.forEach((folder) => {
        if (!fs.existsSync(path.join(appdata, folder))) 
            fs.mkdirSync(path.join(appdata, folder));
    });

    if (!fs.existsSync(path.join(appdata, 'userData.json')))
        _writeDefaultConfig();

    // it's loading config into a variable
    config = JSON.parse(
        fs.readFileSync(path.join(appdata, 'userData.json'))
    );

    // it's updateing config if needed
    if (defaultConfig.schema !== config.schema) {
        // todo config migration
        console.log('Config Migration Required');
        if (config.schema === '0.1.0') {
            // todo
        }
    }
}

function _writeDefaultConfig() {
    const appdata = getAppDataPath('.arkamodded');
    fs.writeFileSync(path.join(appdata, 'userData.json'), JSON.stringify(defaultConfig));
}

function _saveConfig() {
    const appdata = getAppDataPath('.arkamodded');
    fs.writeFileSync(path.join(appdata, 'userData.json'), JSON.stringify(config));
}

export function getBrutConfig() {
    _init();
    return config;
}

export function setBrutConfig(brutConfig=config) {
    _init();
    config = brutConfig;
}

export function getUserData() {
    _init();
    return config.users[0] || null;
}

export function setUserData(userData=defaultConfig.users) {
    _init();
    config.users = [{
        ...userData
    }];
    _saveConfig();
}

export function clearUserData() {
    _init();
    config.users = [];
    _saveConfig();
}

export function hasCustomJavaExecutable() {
    _init();
    return config.games.modded_s1.java.useCustomExecutable;
}

export function setHasCustomJavaExecutable(useCustomJavaExecutable) {
    _init();
    config.games.modded_s1.java.useCustomExecutable = useCustomJavaExecutable;
    _saveConfig();
}

export function getCustomJavaExecutable() {
    _init();
    const customJavaExecutable = config.games.modded_s1.java.customExecutable;
    return customJavaExecutable.length === 0 ? null : customJavaExecutable;
}

export function setCustomJavaExecutable(customJavaExecutable=defaultConfig.games.modded_s1.java.customExecutable) {
    _init();
    config.games.modded_s1.java.customExecutable = customJavaExecutable;
    _saveConfig();
}

export function getJvmOptions() {
    _init();
    return config.games.modded_s1.java.jvmOptions;
}

export function setJvmOptions(jvmOptions=defaultConfig.games.modded_s1.java.jvmOptions) {
    _init();
    config.games.modded_s1.java.jvmOptions = jvmOptions;
    _saveConfig();
}

export function getAllocatedRam() {
    _init();
    return config.games.modded_s1.java.ram;
}

export function setAllocatedRam(min=defaultConfig.games.modded_s1.java.ram.min, max=defaultConfig.games.modded_s1.java.ram.max) {
    _init();
    config.games.modded_s1.java.ram = {
        min,
        max
    };
    _saveConfig();
}

export function getMods() {
    _init();
    return config.games.modded_s1.mods;
}

export function setMods(mods=defaultConfig.games.modded_s1.mods) {
    _init();
    config.games.modded_s1.mods = mods;
    _saveConfig();
}

export function setResolution(width=defaultConfig.games.modded_s1.startup.resolution.width, height=defaultConfig.games.modded_s1.startup.resolution.height) {
    _init();
    config.games.modded_s1.startup.resolution = {
        width, height
    };
    _saveConfig();
}

export function getResolution() {
    _init();
    return config.games.modded_s1.startup.resolution;
}

export function isFullscreen() {
    _init();
    return config.games.modded_s1.startup.fullscreen;
}

export function setFullscreen(fullscreen=defaultConfig.games.modded_s1.startup.fullscreen) {
    _init();
    config.games.modded_s1.startup.fullscreen = fullscreen;
    _saveConfig();
}

export function isAutoconnect() {
    _init();
    return config.games.modded_s1.startup.autoconnect;
}

export function setAutoconnect(autoconnect=defaultConfig.games.modded_s1.startup.autoconnect) {
    _init();
    config.games.modded_s1.startup.autoconnect = autoconnect;
    _saveConfig();
}

export function hasAutoUpdate() {
    _init();
    return config.launcher.autoUpdate;
}

export function setAutoUpdate(autoUpdate) {
    _init();
    config.launcher.autoUpdate = autoUpdate;
    _saveConfig();
}

export function getUpdateState() {
    _init();
    return config.games.modded_s1.updateState;
}

export function setUpdateState(updateState) {
    _init();
    config.games.modded_s1.updateState = updateState;
    _saveConfig();
}

export function checkFileOrFolderExists(filename = '') {
    _init();
    const appdata = getAppDataPath('.arkamodded');
    return fs.existsSync(path.join(appdata, filename));
}

export function getFileOrFolderPath(filename='') {
    _init();
    const appdata = getAppDataPath('.arkamodded');
    return path.join(appdata, filename);
}

export function getFileContents(filename) {
    _init();
    const appdata = getAppDataPath('.arkamodded');
    return fs.readFileSync(path.join(appdata, filename));
}

export function writeFileContents(filename, data) {
    _init();
    const appdata = getAppDataPath('.arkamodded');
    fs.writeFileSync(path.join(appdata, filename), data);
    return true;
}