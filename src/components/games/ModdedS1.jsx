import React, { useEffect, useState } from 'react';
import {AiOutlineFire, AiFillWindows, AiFillApple, AiFillClockCircle, AiOutlineLoading3Quarters, AiFillSetting} from 'react-icons/ai';
import {VscTerminalLinux} from 'react-icons/vsc';
import { FaHdd, FaPlay, FaStop } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';
import { getUpdateState } from '../../utils/config';
import GameUpdater from '../../utils/game/game-updater';
import GameBootstraper from '../../utils/game/game-bootstraper';

export default function ModdedS1() {

    const [gameUpdater, setGameUpdater] = useState(null);
    const [gameBootstraper, setGameBootstraper] = useState(null);
    const [updateState, defUpdateState] = useState('');
    const [progressbar, setProgressbar] = useState(0);
    const [allowButtonClick, setAllowButtonClick] = useState(true);

    useEffect(() => {
        defUpdateState(getUpdateState());

        // it's initializing the game bootstraper
        const _gameBoostraper = new GameBootstraper();
        setGameBootstraper(_gameBoostraper);

        _gameBoostraper.on('updateStateChange', (newUpdateState) => {
            defUpdateState(newUpdateState);
        });

        _gameBoostraper.on('gameClosed', () => {
            defUpdateState('ready');
            setAllowButtonClick(true);
        });

        // it's initializing the game updater

        const _gameUpdater = new GameUpdater();
        setGameUpdater(_gameUpdater);
        _gameUpdater.on('updateStateChange', (newUpdateState) => {
            defUpdateState(newUpdateState);
            if (newUpdateState === 'ready') {
                _gameBoostraper.run();
            }
        });

        _gameUpdater.on('updateProgressChange', (updateProgress) => {
            setProgressbar(updateProgress);
        });
    }, []);

    const handleTriggerUpdate = () => {
        if (!allowButtonClick) return;
        setAllowButtonClick(false);

        if (updateState === 'ready') {
            gameBootstraper.run();
        } else {
            gameUpdater.run();
        }

        setAllowButtonClick(false);
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

    return <div className='w-[60%] h-[320px] bg-black p-2 flex flex-col flex-wrap justify-between items-start rounded relative'>
        <div className='w-full flex flex-nowrap justify-start items-center z-10'>
            <span className='w-fit mr-2 text-xs font-semibold px-3 py-2 flex items-center bg-rose-500 rounded'>
                <AiOutlineFire className='text-sm' />&nbsp;&nbsp;Populaire
            </span>
            <span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <AiFillWindows className='text-sm' />
            </span>
            <span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <AiFillApple className='text-sm' />
            </span>
            <span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <VscTerminalLinux className='text-sm' />
            </span>
        </div>
        <div className='w-full flex flex-nowrap justify-between items-center z-10'>
            <span className='w-fit mr-2 text-sm font-semibold p-3 flex items-center bg-slate-800 rounded'>
                <AiFillClockCircle className='text-xl' />&nbsp;&nbsp;Temps de jeu :&nbsp;<strong>0&nbsp;heures</strong> 
            </span>
            <button onClick={handleTriggerUpdate} className={'w-fit text-sm font-semibold p-3 px-5 flex items-center bg-blue-500 rounded cursor-pointer relative z-10' + (updateState === 'downloading' ? ' bg-slate-900' : '') + ((updateState === 'ready' || updateState === 'hasBeenUpdated') ? ' bg-indigo-500' : '') + ((updateState === 'running') ? ' bg-red-500' : '')}>
                {actionButtonContent}
            </button>
        </div>
        <div className='bg-mc-server-backdrop absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-60 z-0'></div>
    </div>;
}