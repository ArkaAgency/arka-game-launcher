import React from 'react';
import PropTypes from 'prop-types';

export default function LauncherProvider({
    children
}) {
    return <>
        {children}
    </>;
}
LauncherProvider.propTypes = {
    children: PropTypes.any
};