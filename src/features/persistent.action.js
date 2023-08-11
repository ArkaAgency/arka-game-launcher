export const PERSISTENT_SET_UPDATE_STATE = 'persistent/setUpdateState';
export const PERSISTENT_SET_PROGRESS_BAR = 'persistent/setProgressBar';
export const PERSISTENT_SET_ALLOW_BUTTON_CLICK = 'persistent/setAllowButtonClick';

export const persistentSetUpdateState = (updateState) => ({
    type: PERSISTENT_SET_UPDATE_STATE,
    payload: updateState
});

export const persistentSetProgressBar = (progressBar) => ({
    type: PERSISTENT_SET_PROGRESS_BAR,
    payload: progressBar
});

export const persistentSetAllowButtonClick = (allowButtonClick) => ({
    type: PERSISTENT_SET_ALLOW_BUTTON_CLICK,
    payload: allowButtonClick
});