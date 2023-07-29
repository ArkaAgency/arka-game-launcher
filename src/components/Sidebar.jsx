import React from 'react';
import { FiBox, FiMail, FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage } from '../utils/selectors';
import { PAGES } from '../constants/PAGES';
import { definePage } from '../features/page.action';

export function Sidebar(){
    const page = useSelector(selectPage());
    const dispatch = useDispatch();

    const handlePageChange = (e) => {
        if (e.target.dataset.page === page) return;
        dispatch(definePage(e.target.dataset.page));
    };

    return <div className={'flex-shrink-0 w-40 h-full flex flex-col justify-between' + (page === PAGES.BOOSTRAP ? ' hidden' : '')}>
        <div className='w-full'>
            <img src='./icon.png' alt='Arka Group Icon' className='w-[45px]' />
        </div>
        <ul className='flex flex-col w-full'>
            <li className={'m-2 text-slate-500 text-sm font-bold flex items-center w-full cursor-pointer hover:text-white transition-all' + (page === PAGES.CONTENT_MODDED ? ' text-white' : '')} onClick={handlePageChange} data-page={PAGES.CONTENT_MODDED}>
                <FiBox className='text-2xl' />&nbsp;&nbsp;&nbsp;Modded&nbsp;&nbsp;<span className='p-1 rounded bg-slate-800 text-xs font-bold'>S1</span>
            </li>
            <li className={'m-2 text-slate-500 text-sm font-bold flex items-center w-full cursor-pointer hover:text-white transition-all' + (page === PAGES.CONTENT_NEWS ? ' text-white' : '')} onClick={handlePageChange} data-page={PAGES.CONTENT_NEWS}>
                <FiMail className='text-2xl' />&nbsp;&nbsp;&nbsp;Nouveautés
            </li>
        </ul>
        <div className='border-x-1 border-slate-600 border-solid flex justify-between items-center w-full'>
            <div className='flex justify-center items-center'>
                <img src='https://minotar.net/avatar/JustTheWise' alt='Arka Group Icon' className='w-[30px] rounded' />
                <p className='text-xs font-bold'>&nbsp;&nbsp;JustTheWise</p>
            </div>
            <button className={'border-none cursor-pointer text-slate-400 text-xl transition-all hover:text-white' + (page === '' ? ' text-white' : '')}  onClick={handlePageChange} data-page={''}>
                <FiSettings />
            </button>
        </div>
    </div>;
}