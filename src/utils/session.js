import { getUserData } from './config';

/**
 * This method returns the user session validity
 * @date 7/29/2023 - 4:05:33 PM
 *
 * @export
 * @returns {*}
 */
export function isLoggedIn() {
    return new Promise((resolve) => {
        const userData = getUserData();
        if (userData === null || userData === undefined) resolve(false);
        resolve(true);
    });
}