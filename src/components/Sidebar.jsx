import React, { useEffect, useState } from 'react';
import { FiHexagon, FiShoppingCart, FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage } from '../utils/selectors';
import { PAGES } from '../constants/PAGES';
import { definePage } from '../features/page.action';
import { getUserData } from '../utils/config';

export function Sidebar(){
    const [username, setUsername] = useState('');

    const page = useSelector(selectPage());
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = getUserData() || {profile:{name:'PLAYERNAME'}};
        setUsername(userData.profile.name);
    }, [page]);

    const handlePageChange = (e) => {
        console.log(e.currentTarget.getAttribute('data-page'));
        if (e.currentTarget.dataset.page === page) return;
        dispatch(definePage(e.currentTarget.dataset.page));
    };

    return <div className={'flex-shrink-0 w-40 h-full flex flex-col' + ([
        PAGES.AUTH,
        PAGES.BOOSTRAP
    ].includes(page) ? ' hidden' : '')}>
        <div className='w-full'>
            <img src='./icon.png' alt='Arka Group Icon' className='w-[45px]' />
        </div>
        <ul className='flex flex-col w-full mt-10'>
            <li className={'m-2 mb-4 text-slate-500 text-sm font-bold flex items-center w-full cursor-pointer hover:text-white transition-all' + (page === PAGES.HOME ? ' text-white' : '')} onClick={handlePageChange} data-page={PAGES.HOME}>
                <FiHexagon className='text-2xl' />&nbsp;&nbsp;&nbsp;Accueil
            </li>
            <li className={'m-2 mb-4 text-slate-500 text-sm font-bold flex items-center w-full cursor-pointer hover:text-white transition-all' + (page === PAGES.SHOP ? ' text-white' : '')} onClick={handlePageChange} data-page={PAGES.SHOP}>
                <FiShoppingCart className='text-2xl' />&nbsp;&nbsp;&nbsp;Boutique
            </li>
        </ul>
        <div className='border-x-1 border-slate-600 border-solid flex justify-between items-center w-full mt-auto'>
            <div className='flex justify-center items-center'>
                <img src={`https://minotar.net/avatar/${username}`} alt='Arka Group Icon' className='w-[30px] rounded' />
                <p className='text-xs font-bold'>&nbsp;&nbsp;{username}</p>
            </div>
            <button className={'border-none cursor-pointer text-slate-400 text-xl transition-all hover:text-white' + (page.includes('Settings') ? ' text-white' : '')} onClick={handlePageChange} data-page={PAGES.SETTINGS_ACCOUNT}>
                <FiSettings />
            </button>
        </div>
    </div>;
}