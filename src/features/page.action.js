// it's defining the actions constants
export const DEFINE_PAGE = 'page/define';

// it's defining the actions methods

/**
 * Define the new app page
 * @date 7/29/2023 - 4:08:01 PM
 *
 * @param {string} page
 * @returns {{ type: string; payload: any; }}
 */
export const definePage = (page) => ({
    type: DEFINE_PAGE,
    payload: page
});
