import React from 'react';
import {AiFillCalendar, AiOutlineLink, AiFillWindows} from 'react-icons/ai';

export default function BaldiBasicsFanGame() {
    return <div className='w-[48%] h-[320px] bg-black inline-flex flex-col flex-wrap justify-between items-start rounded relative mr-4'>
        <div className="absolute top-0 right-0 h-fit w-fit p-2 flex items-center justify-end">
            <h1 className='text-xs'>Baldi Basics Fan Game</h1>
        </div>
        <div className='w-full flex flex-nowrap justify-start items-center z-10 p-2'>
            <span className='w-fit mr-2 text-xs font-semibold px-3 py-2 flex items-center bg-green-500 rounded'>
                <AiFillCalendar className='text-sm' />&nbsp;&nbsp;Bientôt
            </span>
            <span className='w-fit mr-2 text-xs font-semibold px-2 py-2 flex items-center bg-slate-800 rounded'>
                <AiFillWindows className='text-sm' />
            </span>
        </div>
        <div className='w-full flex flex-nowrap justify-end items-center z-10 p-2'>
            <a onClick={() => {
                require('electron').shell.openExternal('https://go.arka-group.io/launcher-baldi-basics-fan-game');
            }} className={'w-fit text-sm font-semibold p-3 px-5 flex items-center bg-black rounded cursor-pointer relative z-10'}>
                <AiOutlineLink className='text-sm' />&nbsp;&nbsp;En savoir plus
            </a>
        </div>
        <div className='bg-baldi-backdrop bg-cover rounded absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-60 z-0'></div>
    </div>;
}