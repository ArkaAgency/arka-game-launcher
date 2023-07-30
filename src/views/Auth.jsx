import React, { useEffect, useState } from 'react';
import {BsXbox} from 'react-icons/bs';
import {FiAtSign} from 'react-icons/fi';
import PropTypes from 'prop-types';
import { LoadingScreen } from '../components/LoadingScreen';
import { ipcRenderer } from 'electron';

export function Auth() {

    const [loginMethod, setLoginMethod] = useState(null);

    const handleAuthChoiceUpdate = (newAuthChoice) => {
        // todo handle normal login
        if (newAuthChoice === 'normal') return alert('Ce mode de connexion est actuellement indisponible.');
        setLoginMethod(newAuthChoice);
    };
 
    return <>
        {
            loginMethod === null ? <AuthChoice onChoiceUpdate={handleAuthChoiceUpdate} /> : 
                (loginMethod === 'microsoft' ? <MicrosoftLogin onChoiceUpdate={handleAuthChoiceUpdate} /> : '')
        }
    </>;
}

function AuthChoice({
    onChoiceUpdate
}) {
    const handleLoginChoice = (e) => {
        onChoiceUpdate(e.target.dataset.choice);
    };

    return <div className='flex justify-center items-center flex-wrap'>
        <div>
            <img src="./icon.png" alt="Arka Group Icon" className='w-[60px] mx-auto mb-2' />
            <p className='mb-2 w-full text-center'>Bienvenue sur le <strong>Arka Game Launcher</strong>, merci de te connecter pour continuer.</p>
        </div>
        <div className='w-full'>
            <button className='mb-[5px] w-fit border-none rounded bg-emerald-500 text-white font-medium p-2 hover:bg-emerald-600 flex items-center justify-center text-sm mx-auto' onClick={handleLoginChoice} data-choice='microsoft'>
                <BsXbox className='text-xl' />&nbsp;&nbsp;&nbsp;with Microsoft Account
            </button>
            <button className='mb-[5px] w-fit border-none rounded bg-indigo-500 text-white font-medium p-2 hover:bg-indigo-600 flex items-center justify-center text-sm mx-auto' onClick={handleLoginChoice} data-choice='normal'>
                <FiAtSign className='text-xl' />&nbsp;&nbsp;&nbsp;with Email & Password
            </button>
        </div>
    </div>;
}
AuthChoice.propTypes = {
    onChoiceUpdate: PropTypes.func
};

function MicrosoftLogin({
    onChoiceUpdate
}) {
    useEffect(() => {
        ipcRenderer.invoke('login.microsoft.open');
        // it's handling microsoft login success
        ipcRenderer.on('login.microsoft.success', (event, data) => {
            console.log(data);
            // todo store session, create remote account, ...
        });
        // it's handling microsoft login error
        ipcRenderer.on('login.microsoft.error', (event, error) => {
            console.error(error);
            onChoiceUpdate(null);
        });
    }, []);

    return <LoadingScreen />;
}
MicrosoftLogin.propTypes = {
    onChoiceUpdate: PropTypes.func
};