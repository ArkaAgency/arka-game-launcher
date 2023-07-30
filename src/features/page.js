import { DEFINE_PAGE } from './page.action';
import { PAGES } from '../constants/PAGES';

// it's defining the initial state
const initialState = PAGES.BOOSTRAP;

/**
 * The page reducder
 * @date 7/29/2023 - 11:43:31 AM
 *
 * @export
 * @param {string} [state=initialState]
 * @param {object} action
 * @returns {*}
 */
export function pageReducer(state = initialState, action) {
    if (action.type === DEFINE_PAGE) {
        return action.payload;
    }
    return state;
}