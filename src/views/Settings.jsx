import React, { useEffect, useState } from 'react';
import { SettingsSidebar } from '../components/SettingsSidebar';
import PropTypes from 'prop-types';
import { MdVerified, MdDelete } from 'react-icons/md';
import { LiaJava } from 'react-icons/lia';
import getModsListFromAPI, { ModTypes, deleteLocalMod, getModsListFromLocal, importLocalMod, setAllModsEnabled, toggleMod } from '../utils/game/mods-utils';
import * as dialog from 'node-file-dialog';
import { getAllocatedRam, hasAutoUpdate, isAutoconnect, isFullscreen, setAllocatedRam, setAutoUpdate, setAutoconnect, setFullscreen } from '../utils/config';
import * as os from 'os';

export function Settings({
    pageComponent
}) {
    return <div className='flex flex-nowrap m-6 ml-10 mt-10 p-6 rounded bg-gray-950 w-full h-auto'>
        <SettingsSidebar />
        {pageComponent}
    </div>;
}
Settings.propTypes = {
    pageComponent: PropTypes.any
};

export function SettingsAccount() {
    return <div>
        
    </div>;
}

export function SettingsMinecraft() {

    const [fullscreen, defFullscreen] = useState(false);
    const [autoconnect, defAutoconnect] = useState(false);

    useEffect(() => {
        defFullscreen(isFullscreen());
        defAutoconnect(isAutoconnect());
    }, []);

    const handleChange = (e) => {
        const obj = {
            'fullscreen': defFullscreen,
            'autoconnect': defAutoconnect
        };
        obj[e.target.name](e.target.checked);
        const obj2 = {
            'fullscreen': setFullscreen,
            'autoconnect': setAutoconnect
        };
        obj2[e.target.name](e.target.checked);
    };

    return <div>
        <h1 className='text-2xl font-semibold text-white'>Minecraft</h1>
        <p className="text-xs text-gray-400 mb-2">Ici vous pouvez gérer les options de lancement de votre jeu.</p>

        <label className="w-full mb-2 relative inline-flex items-center cursor-pointer mt-3" htmlFor='fullscreen'>
            <input type="checkbox" checked={fullscreen} onChange={handleChange} name='fullscreen' id='fullscreen' className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Lancer le jeu en plein écran</span>
        </label>

        <label className="w-full relative inline-flex items-center cursor-pointer mt-3" htmlFor='autoconnect'>
            <input type="checkbox" checked={autoconnect} onChange={handleChange} name='autoconnect' id='autoconnect' className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Se connecter automatiquement au serveur</span>
        </label>
    </div>;
}

export function SettingsJava() {

    const [ram, setRam] = useState({
        min: 512,
        max: 1024
    });
    const [sysMem, setSysMem] = useState({
        FreeMem: 1024, 
        TotalMem: 1024
    });

    useEffect(() => {
        const {min, max} = getAllocatedRam();
        setRam({ min, max });

        const osFreeMem = os.freemem();
        const allFreeMem = (osFreeMem / (1024 * 1024));
        const osTotalMem = os.totalmem();
        const allTotalMem = (osTotalMem / (1024 * 1024));
        setSysMem({
            FreeMem: allFreeMem,
            TotalMem: allTotalMem
        });
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'min-ram') {
            const newRam = {
                max: ram.max,
                min: Number.parseInt(e.target.value)
            };
            setAllocatedRam(newRam.min, newRam.max);
            setRam(newRam);
        } else if (e.target.name === 'max-ram') {
            const newRam = {
                min: ram.min,
                max: Number.parseInt(e.target.value)
            };
            setAllocatedRam(newRam.min, newRam.max);
            setRam(newRam);
        }
    };

    return <div className='w-full h-full'>
        <h1 className='text-2xl font-semibold text-white'>Java</h1>
        <p className="text-xs text-gray-400 mb-2">Ici vous pouvez gérer les paramètres de l&apos;environnement d&apos;exécution de Java. La mémoire maximale recommandée est de 4 Gb.</p>
        
        <div className="flex items-center justify-between w-full mb-1">
            <label htmlFor="min-ram" className="block mb-1 mt-3 text-sm font-medium text-gray-900 dark:text-white text-left w-[49%]">Mémoire Ram Minimale <span className='p-1 text-xs rounded bg-orange-500 text-white uppercase font-semibold cursor-pointer'>{Math.round((ram.min / 1024) * 10)/10} Gb</span></label>
            <label htmlFor="max-ram" className="block mb-1 mt-3 text-sm font-medium text-gray-900 dark:text-white text-right w-[49%]">Mémoire Ram Maximale <span className='p-1 text-xs rounded bg-orange-500 text-white uppercase font-semibold cursor-pointer'>{Math.round((ram.max / 1024) * 10)/10} Gb</span></label>
        </div>

        <div className="flex items-center justify-between w-full">
            <input id="min-ram" type="range" min='512' max={ram.max} step='512' value={ram.min} name='min-ram' onChange={handleChange} className="w-[49%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            <input id="max-ram" type="range" min={ram.min} max={sysMem.TotalMem} step='512' value={ram.max} name='max-ram' onChange={handleChange} className="w-[49%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        </div>

    </div>;
}

export function SettingsMods() {

    const [mods, setMods] = useState([]);
    const [refreshes, setRefreshes] = useState(0);

    useEffect(() => {
        const fetchAllMods = async () => {
            const localModsRes = await getModsListFromLocal();
            getModsListFromAPI()
                .then((remoteModsRes) => {
                    if (!remoteModsRes.success) return;
                    const remoteMods = remoteModsRes.mods;
                    setMods([
                        ...localModsRes,
                        ...remoteMods
                    ]);
                });
        };

        fetchAllMods()
            .catch((err) => {
                console.log(err);
            });
    }, [refreshes]);

    const handleModToggle = (mod) => {
        toggleMod(mod.type, mod.md5);
        const filteredMods = mods.map((newMod) => {
            if (newMod.md5 === mod.md5)
                mod.enabled = !mod.enabled;
            return newMod;
        });
        setMods(filteredMods);
    };

    const handleModDeletion = (mod) => {
        deleteLocalMod(mod);
        const filteredMods = mods.filter((m) => m.md5 !== mod.md5);
        setMods(filteredMods);
    };

    const handleModImport = () => {
        dialog({
            type: 'open-files'
        }).then((files) => {
            files.forEach((file) => {
                importLocalMod(file);
                setRefreshes(refreshes + 1);
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleSetAllModsEnabled = (type, enabled) => {
        setAllModsEnabled(mods, type, enabled);
        const mappedMods = mods.map((m) => {
            if (m.type === type)
                m.enabled = enabled;
            return m;
        });
        setMods(mappedMods);
    };

    const handleRefresh = () => {
        setRefreshes(refreshes + 1);
    };

    return <div className='overflow-y-scroll'>
        <h1 className='text-2xl font-semibold text-white'>Mods <button onClick={handleRefresh} className='rounded text-sm p-1 m-1 bg-blue-600 hover:bg-blue-600 transition-all'>Recharger</button></h1>
        <p className="text-xs text-gray-400 mb-2">Ici vous pouvez gérer les mods optionnels et même ajouter les votres.</p>

        <h2 className='text-xl mt-6 font-semibold'>Mods Personnalisés <button onClick={handleModImport} className='rounded text-sm p-1 m-1 bg-blue-600 hover:bg-blue-600 transition-all'>Importer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Local, true)} className='rounded text-sm p-1 m-1 bg-green-500 hover:bg-green-600 transition-all'>Tout activer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Local, false)} className='rounded text-sm p-1 m-1 bg-red-500 hover:bg-red-600 transition-all'>Tout désactiver</button></h2>
        <p className="text-xs text-gray-400 mb-2">Nous vous rappeleons que nous ne sommes pas responsables des crash liés aux mods personnalisés et que les mods liés à la triche ne seront pas tolérés.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Local).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer hover:bg-red-500 transition-all'>
                        <LiaJava className='text-xl group-hover:hidden' />
                        <MdDelete className='text-xl hidden group-hover:block' onClick={() => handleModDeletion(mod)} />
                    </div>
                    <div className='cursor-pointer relative'>
                        <input type="checkbox" id={mod.md5 + '_input'} checked={mod.enabled} onChange={() => handleModToggle(mod)} className="sr-only peer" />
                        <label htmlFor={mod.md5 + '_input'} className="block w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></label>
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>

        <h2 className='text-xl mt-6 font-semibold'>Mods Performances <button onClick={() => handleSetAllModsEnabled(ModTypes.Performances, true)} className='rounded text-sm p-1 m-1 bg-green-500 hover:bg-green-600 transition-all'>Tout activer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Performances, false)} className='rounded text-sm p-1 m-1 bg-red-500 hover:bg-red-600 transition-all'>Tout désactiver</button></h2>
        <p className="text-xs text-gray-400 mb-2">Ces mods améliorent grandement les performances de votre jeu. Il est vivement déconseillé de les désactiver.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Performances).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer'>
                        <LiaJava className='text-xl' />
                    </div>
                    <div className='cursor-pointer relative'>
                        <input id={mod.md5 + '_input'} onChange={() => handleModToggle(mod)} type="checkbox" checked={mod.enabled} className="sr-only peer" />
                        <label htmlFor={mod.md5 + '_input'} className="block w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></label>
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>

        <h2 className='text-xl mt-6 font-semibold'>Mods Optionnels <button onClick={() => handleSetAllModsEnabled(ModTypes.Optionnal, true)} className='rounded text-sm p-1 m-1 bg-green-500 hover:bg-green-600 transition-all'>Tout activer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Optionnal, false)} className='rounded text-sm p-1 m-1 bg-red-500 hover:bg-red-600 transition-all'>Tout désactiver</button></h2>
        <p className="text-xs text-gray-400 mb-2">Ces mods vous donnent une meilleure expérience de jeu ainsi qu&apos;un meilleur confort. Vous pouvez les désactiver pour gagner en performances.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Optionnal).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer'>
                        <LiaJava className='text-xl' />
                    </div>
                    <div className='cursor-pointer relative'>
                        <input id={mod.md5 + '_input'} onChange={() => handleModToggle(mod)} type="checkbox" checked={mod.enabled} className="sr-only peer" />
                        <label htmlFor={mod.md5 + '_input'} className="block w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></label>
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>

        <h2 className='text-xl mt-6 font-semibold'>Mods Requis</h2>
        <p className="text-xs text-gray-400 mb-2">Ces mods sont requis pour se connecter au serveur et ne sont donc pas désactivables.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Required).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer'>
                        <LiaJava className='text-xl' />
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>
    </div>;
}

export function SettingsUpdate() {

    const [autoUpdate, defAutoUpdate] = useState(false);

    useEffect(() => {
        defAutoUpdate(hasAutoUpdate());
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'autoUpdate') {
            defAutoUpdate(e.target.checked);
            setAutoUpdate(e.target.checked);
        }
    };

    return <div>
        <h1 className='text-2xl font-semibold text-white'>Mises à jour</h1>
        <label className="relative inline-flex items-center cursor-pointer mt-3" htmlFor='autoUpdate'>
            <input type="checkbox" checked={autoUpdate} onChange={handleChange} name='autoUpdate' id='autoUpdate' className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activer les mises à jour automatiques du Launcher</span>
        </label>
    </div>;
}