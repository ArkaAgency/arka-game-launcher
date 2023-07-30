import React, { useEffect } from 'react';
import { isLoggedIn } from '../utils/session';
import { useDispatch } from 'react-redux';
import { PAGES } from '../constants/PAGES';
import { definePage } from '../features/page.action';
import { LoadingScreen } from '../components/LoadingScreen';

export default function Bootstrap() {

    const dispatch = useDispatch();

    useEffect(() => {
        isLoggedIn().then((res) => {
            if (!res.validity) return dispatch(definePage(PAGES.AUTH));
            dispatch(definePage(PAGES.CONTENT_MODDED));
        });
    });

    return <LoadingScreen />;
}
