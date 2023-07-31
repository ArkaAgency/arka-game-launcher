import React from 'react';
import { PAGES } from '../constants/PAGES';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage } from '../utils/selectors';
import { definePage } from '../features/page.action';

export function SettingsSidebar() {
    
    const dispatch = useDispatch();
    const page = useSelector(selectPage());

    const handlePageChange = (e) => {
        if (e.currentTarget.dataset.page === page) return;
        dispatch(definePage(e.currentTarget.dataset.page));
    };

    return <ul className='h-100 w-[140px] mr-3 flex flex-col flex-wrap border-r-2 border-solid border-gray-800'>
        <li 
            className={'w-fit min-w-[71px] p-1 px-2 mb-1 text-sm text-gray-600 font-semibold cursor-pointer hover:text-white transition-all' + (page === PAGES.SETTINGS_ACCOUNT ? ' text-white' : '')}
            onClick={handlePageChange} data-page={PAGES.SETTINGS_ACCOUNT}>Mon Compte</li>
        <li 
            className={'w-fit min-w-[71px] p-1 px-2 mb-1 text-sm text-gray-600 font-semibold cursor-pointer hover:text-white transition-all' + (page === PAGES.SETTINGS_MINECRAFT ? ' text-white' : '')}
            onClick={handlePageChange} data-page={PAGES.SETTINGS_MINECRAFT}>Lancement</li>
        <li 
            className={'w-fit min-w-[71px] p-1 px-2 mb-1 text-sm text-gray-600 font-semibold cursor-pointer hover:text-white transition-all' + (page === PAGES.SETTINGS_MODS ? ' text-white' : '')}
            onClick={handlePageChange} data-page={PAGES.SETTINGS_MODS}>Mods</li>
        <li 
            className={'w-fit min-w-[71px] p-1 px-2 mb-1 text-sm text-gray-600 font-semibold cursor-pointer hover:text-white transition-all' + (page === PAGES.SETTINGS_JAVA ? ' text-white' : '')}
            onClick={handlePageChange} data-page={PAGES.SETTINGS_JAVA}>Java</li>
        <li 
            className={'w-fit min-w-[71px] p-1 px-2 mb-1 text-sm text-gray-600 font-semibold cursor-pointer hover:text-white transition-all' + (page === PAGES.SETTINGS_UPDATE ? ' text-white' : '')}
            onClick={handlePageChange} data-page={PAGES.SETTINGS_UPDATE}>Mises à jour</li>
    </ul>;
}