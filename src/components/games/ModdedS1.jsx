import React, { useEffect, useState } from 'react';
import {AiOutlineFire, AiFillWindows, AiFillClockCircle, AiOutlineLoading3Quarters, AiFillSetting} from 'react-icons/ai';
import { FaHdd, FaPlay, FaStop } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { selectPersistentState } from '../../utils/selectors';
import { persistentSetAllowButtonClick, persistentSetProgressBar, persistentSetUpdateState } from '../../features/persistent.action';

export default function ModdedS1() {

    const persistentState = useSelector(selectPersistentState());
    const dispatch = useDispatch();

    const [updateState, defUpdateState] = useState('');
    const [progressbar, setProgressbar] = useState(0);
    const [allowButtonClick, setAllowButtonClick] = useState(true);

    useEffect(() => {
        defUpdateState(persistentState.updateState);
        setProgressbar(persistentState.progressBar);
        setAllowButtonClick(persistentState.allowButtonClick);

        persistentState.gameBootstraper.on('updateStateChange', (newUpdateState) => {
            defUpdateState(newUpdateState);
            dispatch(persistentSetUpdateState(newUpdateState));
        });
        persistentState.gameBootstraper.on('gameClosed', () => {
            defUpdateState('ready');
            dispatch(persistentSetUpdateState('ready'));
            setAllowButtonClick(true);
            dispatch(persistentSetAllowButtonClick(true));
        });
        persistentState.gameUpdater.on('updateStateChange', (newUpdateState) => {
            defUpdateState(newUpdateState);
            dispatch(persistentSetUpdateState(newUpdateState));
            if (newUpdateState === 'ready') {
                persistentState.gameBootstraper.run();
            }
        });
        persistentState.gameUpdater.on('updateProgressChange', (updateProgress) => {
            setProgressbar(updateProgress);
            dispatch(persistentSetProgressBar(updateProgress));
        });
    }, []);

    const handleTriggerUpdate = () => {
        if (!allowButtonClick) return;
        setAllowButtonClick(false);
        dispatch(persistentSetAllowButtonClick(false));

        if (updateState === 'ready') {
            persistentState.gameBootstraper.run();
        } else {
            persistentState.gameUpdater.run();
        }

        setAllowButtonClick(false);
        dispatch(persistentSetAllowButtonClick(false));
    };

    const actionButtonContent = {
        'launching':          <><AiOutlineLoading3Quarters className='text-xl animate-spin' />&nbsp;&nbsp;Lancement</>,
        'running':          <><FaStop className='text-sm' />&nbsp;&nbsp;Fermer le jeu</>,
        'ready':          <><FaPlay className='text-sm animate-pulse' />&nbsp;&nbsp;Jouer</>,
        'hasBeenUpdated': <><FaPlay className='text-sm animate-pulse' />&nbsp;&nbsp;Jouer</>,
        'uninstalled': <><FaHdd className='text-xl' />&nbsp;&nbsp;Installer</>,
        'loading': <><AiOutlineLoading3Quarters className='text-xl animate-spin' />&nbsp;&nbsp;Chargement</>,
        'checking': <><AiFillSetting className='text-xl animate-spin' />&nbsp;&nbsp;Vérification</>,
        'downloading': <>
            <RxUpdate className='text-sm animate-spin z-10' />&nbsp;&nbsp;<span className='z-10'>Téléchargement {progressbar}%</span>
            <div className='absolute h-full rounded bg-indigo-500 z-0 left-0' style={{
                width: `${progressbar}%`
            }}></div>
        </>,
        '': <>{progressbar}</>
    }[updateState];

    return <div className='w-[48%] h-[320px] bg-black inline-flex flex-col flex-wrap justify-between items-start rounded relative mr-4'>
        <div className="absolute top-0 right-0 h-fit w-fit p-2 flex items-center justify-end">
            <h1 className='text-xs'>Arka Modded Saison 1</h1>
        </div>
        <div className='w-full flex flex-nowrap justify-start items-center z-10 p-2'>
            <span className='w-fit mr-2 text-xs font-semibold px-3 py-2 flex items-center bg-red-500 rounded'>
                <AiOutlineFire className='text-sm' />&nbsp;&nbsp;Nouveauté
            </span>
            <span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <AiFillWindows className='text-sm' />
            </span>
            {/*<span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <AiFillApple className='text-sm' />
            </span>
            <span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <VscTerminalLinux className='text-sm' />
            </span>*/}
        </div>
        <div className="w-full flex flex-nowrap justify-center items-center z-10">
            <img src="./minecraft_title.png" alt="Arka Modded Minecraft Title" className='h-[110px]'/>
        </div>
        <div className='w-full flex flex-nowrap justify-between items-center z-10 p-2'>
            <span className='w-fit mr-2 text-sm font-semibold p-3 flex items-center bg-slate-800 rounded'>
                <AiFillClockCircle className='text-xl' />&nbsp;&nbsp;Temps de jeu :&nbsp;<strong>0&nbsp;heures</strong> 
            </span>
            <button onClick={handleTriggerUpdate} className={'w-fit text-sm font-semibold p-3 px-5 flex items-center bg-orange-500 rounded cursor-pointer relative z-10' + (updateState === 'downloading' ? ' bg-slate-900' : '') + ((updateState === 'ready' || updateState === 'hasBeenUpdated') ? ' bg-indigo-500' : '') + ((updateState === 'running') ? ' bg-red-500' : '')}>
                {actionButtonContent}
            </button>
        </div>
        <div className='bg-mc-server-backdrop bg-cover rounded absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-60 z-0'></div>
    </div>;
}