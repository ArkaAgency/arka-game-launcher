import React from 'react';
import {AiOutlineFire, AiFillWindows, AiFillApple, AiFillClockCircle, AiOutlineDownload} from 'react-icons/ai';
import {VscTerminalLinux} from 'react-icons/vsc';

export function Home() {
    return <div className='w-full h-full p-10 justify-start flex-wrap items-start'>
        <div className="w-full mb-4">
            <h1 className='text-2xl font-semibold'>Bonjour, JustTheWise !</h1>
        </div>
        <div className='w-[60%] h-[320px] bg-black p-2 flex flex-col flex-wrap justify-between items-start rounded relative cursor-pointer'>
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
                <button className='w-fit text-sm font-semibold p-3 px-5 flex items-center bg-blue-500 rounded'>
                    <AiOutlineDownload className='text-xl' />&nbsp;&nbsp;Installer
                </button>
            </div>
            <div className='bg-mc-server-backdrop absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-60 z-0'></div>
        </div>
    </div>;
}