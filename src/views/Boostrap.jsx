import React, { useEffect } from 'react';
import { isLoggedIn } from '../utils/session';
import { useDispatch } from 'react-redux';
import { PAGES } from '../constants/PAGES';
import { definePage } from '../features/page.action';
import { LoadingScreen } from '../components/LoadingScreen';
import { ipcRenderer } from 'electron';

export default function Bootstrap() {

    const dispatch = useDispatch();

    useEffect(() => {
        isLoggedIn().then((validity) => {
            if (!validity) return dispatch(definePage(PAGES.AUTH));
            dispatch(definePage(PAGES.HOME));
            ipcRenderer.invoke('main');
        });
    });

    return <LoadingScreen />;
}
