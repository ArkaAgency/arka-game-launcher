import { ipcRenderer } from 'electron';
import React from 'react';
import { FiX, FiMinus } from 'react-icons/fi';

export function TopBar() {

    const handleClose = () => {
        ipcRenderer.invoke('close');
    };

    const handleMinimize = () => {
        ipcRenderer.invoke('minimize');
    };

    return <div className='fixed h-fit w-full top-0 right-0 left-0 flex justify-end flex-nowrap'>
        <div className='draggable h-[40px] flex-1'></div>
        <div className='w-fit'>
            <button className='inline-flex justify-center items-center h-[30px] w-[30px] bg-transparent text-slate-400 hover:text-white transition-all mt-1 mr-1' onClick={handleMinimize}>
                <FiMinus className='text-2xl' />
            </button>
            <button className='inline-flex justify-center items-center h-[30px] w-[30px] bg-transparent text-slate-400 hover:text-white transition-all mt-1 mr-2' onClick={handleClose}>
                <FiX className='text-2xl' />
            </button>
        </div>
    </div>;
}