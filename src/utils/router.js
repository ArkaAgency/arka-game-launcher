import React from 'react';
import {App} from '../components/_App';
import { useSelector } from 'react-redux';
import { selectPage } from '../utils/selectors';
import Bootstrap from '../views/Boostrap';
import { PAGES } from '../constants/PAGES';
import { Auth } from '../views/Auth';
import { Home } from '../views/Home';
import { Shop } from '../views/Shop';
import { Settings } from '../views/Settings';


/**
 * Renders the App Router compenent who manages the routing
 * @date 7/29/2023 - 12:29:20 PM
 *
 * @export
 * @returns {*}
 */
export function AppRouter() {
    // it's getting the page from redux and loading its component from routes
    const page = useSelector(selectPage());
    const pageElement = Routes[page];

    return <>
        <App element={pageElement} />
    </>;
}

/**
 * The App Routes Array
 * @date 7/29/2023 - 12:29:47 PM
 *
 * @type {{ [x: string]: React.Component; }}
 */
export const Routes = {
    [PAGES.BOOSTRAP]: <Bootstrap />,
    [PAGES.AUTH]: <Auth />,
    [PAGES.HOME]: <Home />,
    [PAGES.SHOP]: <Shop />,
    [PAGES.SETTINGS_ACCOUNT]: <Settings />
};