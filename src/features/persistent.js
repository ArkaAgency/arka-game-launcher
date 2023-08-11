import GameUpdater from '../utils/game/game-updater';
import GameBootstraper from '../utils/game/game-bootstraper';
import { getUpdateState } from '../utils/config';
import { PERSISTENT_SET_ALLOW_BUTTON_CLICK, PERSISTENT_SET_PROGRESS_BAR, PERSISTENT_SET_UPDATE_STATE } from './persistent.action';

const initialState = {
    gameUpdater: new GameUpdater(),
    gameBootstraper: new GameBootstraper(),
    updateState: getUpdateState(),
    progressBar: 0,
    allowButtonClick: true,
};

/**
 * The persistent reducder
 * @date 7/29/2023 - 11:43:31 AM
 *
 * @export
 * @param {string} [state=initialState]
 * @param {object} action
 * @returns {*}
 */
export function persistentReducer(state = initialState, action) {
    if (action.type === PERSISTENT_SET_ALLOW_BUTTON_CLICK) {
        return {
            ...state,
            allowButtonClick: action.payload
        };
    } else if (action.type === PERSISTENT_SET_PROGRESS_BAR) {
        return {
            ...state,
            progressBar: action.payload
        };
    } else if (action.type === PERSISTENT_SET_UPDATE_STATE) {
        return {
            ...state,
            updateState: action.payload
        };
    }
    return state;
}