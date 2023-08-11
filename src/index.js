import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import {store} from './utils/store';
import {AppRouter} from './utils/router';
import LauncherProvider from './components/LauncherProvider';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <StoreProvider store={store}>
            <LauncherProvider>
                <AppRouter />
            </LauncherProvider>
        </StoreProvider>
    </>
);
