import React from 'react';
import ModdedS1 from '../components/games/ModdedS1';

export function Home() {
    return <div className='w-full h-full p-10 justify-start flex-wrap items-start'>
        <div className="w-full mb-4">
            <h1 className='text-2xl font-semibold'>Bonjour, JustTheWise !</h1>
        </div>
        <ModdedS1 />
    </div>;
}