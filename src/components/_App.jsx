import React from 'react';
import PropTypes from 'prop-types';

/**
 * The App core React Component
 * @date 7/29/2023 - 11:29:12 AM
 *
 * @export
 * @param {{ element: any; }} { element }
 * @returns
 */
export function App({ element }) {
    console.log(element);
    return <>
        {element}
    </>;
}

App.propTypes = {
    element: PropTypes.any
};
