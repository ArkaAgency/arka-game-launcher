// it's defining the page selectors

/**
 * Select the page from redux store
 * @date 7/29/2023 - 12:30:14 PM
 *
 * @returns {(state: object) => string}
 */
export const selectPage = () => {
    return (state) => state.page;
};

/**
 * Select the persistent game state from redux store
 * @date 7/29/2023 - 12:30:14 PM
 *
 * @returns {(state: object) => any}
 */
export const selectPersistentState = () => {
    return (state) => state.persistent;
};