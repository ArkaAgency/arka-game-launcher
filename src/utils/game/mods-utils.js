import * as fs from 'fs';
import { getFileOrFolderPath, getMods, setMods } from '../config';
import * as util from 'util';
import * as jarfile from 'jarfile';
import { createHash } from 'crypto';
import * as axios from 'axios';

const asyncJarCheck = util.promisify(jarfile.fetchJarAtPath);

/**
 * Get the mods list from the Arka Modded API
 * @date 7/31/2023 - 8:04:16 PM
 *
 * @export
 * @returns {*}
 */
export default function getModsListFromAPI() {
    return new Promise((resolve) => {
        axios.get('https://api.modded.arka-group.io/update/mods')
            .then((res) => res.data)
            .then((data) => {
                resolve({
                    success: true,
                    mods: data.mods.map((mod) => {
                        return new Mod({ 
                            ...mod,
                            enabled: mod.type === ModTypes.Required || (getMods().find((m) => m.md5 === mod.md5) !== undefined)
                        });
                    })
                });
            })
            .catch((err) => {
                console.error(err);
                resolve({
                    success: false
                });
            });
    });
}

/**
 * Description placeholder
 * @date 8/1/2023 - 12:07:15 AM
 *
 * @export
 * @async
 * @returns {Promise<Array<Mod>>}
 */
export async function getModsListFromLocal() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        const localModsPath = getFileOrFolderPath('mods/local/');
        const localModsFiles =  fs.readdirSync(localModsPath);
        const filteredLocalModsFiles = localModsFiles.filter((mod) => {
            // todo check cheat hashes / filename / ...
            return mod.endsWith('.jar');
        });

        const finalMods = [];
        for await (const mod of filteredLocalModsFiles) {
            const modFilename = getFileOrFolderPath(`mods/local/${mod}`);
            
            const modBuffer = fs.readFileSync(modFilename);
            const modHash = createHash('md5').update(modBuffer).digest('hex');

            let jarInfos;
            try {
                const jarInfosFetch = await asyncJarCheck(modFilename);
                jarInfos = {
                    name: jarInfosFetch.valueForManifestEntry('Specification-Title') || jarInfosFetch.valueForManifestEntry('Implementation-Title') || mod,
                    author: jarInfosFetch.valueForManifestEntry('Specification-Vendor') || jarInfosFetch.valueForManifestEntry('Implementation-Vendor') || '???',
                    version: jarInfosFetch.valueForManifestEntry('Implementation-Version') || jarInfosFetch.valueForManifestEntry('Specification-Version') || '???'
                };
            } catch {
                jarInfos = {
                    name: mod,
                    author: '???',
                    version: '???'
                };
            }

            finalMods.push(new Mod({
                type: 'local',
                description: 'An installed custom mod!',
                name: jarInfos.name,
                author: jarInfos.author,
                version: jarInfos.version,
                md5: modHash,
                filename: mod,
                enabled: (getMods().find((m) => m.md5 === modHash) !== undefined)
            }));
        }

        resolve(finalMods);
    });
}

/**
 * Toggle mod activation in the config
 * @date 8/1/2023 - 1:37:39 PM
 *
 * @export
 * @param {string} md5 - the mod file md5 hex hash
 * @param {ModTypes} type - the mod type
 */
export function toggleMod(type, md5) {
    let mods = getMods();

    if (mods.find((m) => m.md5 === md5))
        setMods(mods.filter((mod) => mod.md5 !== md5));

    if (!mods.find((m) => m.md5 === md5))
        setMods([
            ...mods,
            {
                type, md5
            }
        ]);
}


/**
 * Disable or enable all mods of a category
 * @date 8/1/2023 - 1:57:12 PM
 *
 * @export
 * @param {*} modsList - the mods list
 * @param {*} type - the mods type
 * @param {*} enabled - set if the mods should all be enabled or disabled
 */
export function setAllModsEnabled(modsList, type, enabled) {
    let mods = getMods();

    if (enabled) 
        modsList.filter((m) => m.type === type).forEach(m => {
            if (mods.find((m2) => m2.md5 === m.md5) !== undefined) return;
            mods.push({
                type: m.type, md5: m.md5
            });
        });

    if (!enabled)
        mods = mods.filter((m) => m.type !== type);

    setMods(mods);
}


/**
 * Delete a local from files and config if enabled
 * @date 8/1/2023 - 2:03:32 PM
 *
 * @export
 * @param {Mod} mod - The mod class
 */
export function deleteLocalMod(mod) {
    // it's removing the mod from the config if needed
    let mods = getMods();
    if (mods.find((m) => m.md5 === mod.md5) !== undefined)
        mods = mods.filter((m) => m.md5 !== mod.md5);
    setMods(mods);

    // it's deleting the mod from local folder
    const modFilename = getFileOrFolderPath(`mods/local/${mod.filename}`);
    console.log(modFilename);
    fs.rm(modFilename);
}

export function importLocalMod(filename) {
    if (!filename.endsWith('.jar')) return;
    let parsedFilename = filename.split('/');
    parsedFilename = parsedFilename[parsedFilename.length - 1];
    const destPath = getFileOrFolderPath(`mods/local/${parsedFilename}`);
    fs.cpSync(filename, destPath);
}

/**
 * The Mod structure
 * @date 7/31/2023 - 7:19:04 PM
 *
 * @class Mod
 * @typedef {Mod}
 */
export class Mod {
    /**
     * Creates an instance of Mod.
     * @date 7/31/2023 - 7:19:24 PM
     *
     * @constructor
     * @param {{ name?: string; description?: string; author?: string; version?: string; forgeVersion?: string; filename?: string; md5?: string; type?: string; enabled?: boolean }} {
            name = 'Unknown',
            description = 'Unknown',
            author = 'Unknown',
            version = 'Unknown',
            forgeVersion = 'Unknown',
            filename = 'nomod.jar',
            md5 = 'Unknown'
            type = 'required'
            enabled = true
        }
     */
    constructor({
        name = 'Unknown',
        description = 'Unknown',
        author = 'Unknown',
        version = 'Unknown',
        forgeVersion = 'Unknown',
        filename = 'nomod.jar',
        md5 = 'Unknown',
        hash = 'Unknown',
        type = 'required',
        enabled = true
    }) {
        this.name = name;
        this.description = description;
        this.author = author;
        this.version = version;
        this.forgeVersion = forgeVersion;
        this.filename = filename;
        this.md5 = md5 || hash;
        this.type = type;
        this.enabled = enabled;
    }
}

/**
 * The diffenret mod types
 * @date 8/1/2023 - 12:15:11 AM
 *
 * @type {{ Required: string; Performances: string; Local: string; Optionnal: string; }}
 */
export const ModTypes = {
    Required: 'required',
    Performances: 'performances',
    Local: 'local',
    Optionnal: 'optionnals'
};