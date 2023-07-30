import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from './Sidebar';

/**
 * The App core React Component
 * @date 7/29/2023 - 11:29:12 AM
 *
 * @export
 * @param {{ element: any; }} { element }
 * @returns
 */
export function App({ element }) {
    return <div className='bg-slate-900 text-white h-full w-full p-5 flex'>
        <Sidebar />
        {element}
    </div>;
}

App.propTypes = {
    element: PropTypes.any
};
