import { combineReducers, createStore } from 'redux';
import {pageReducer} from '../features/page';
import { persistentReducer } from '../features/persistent';

const reducers = combineReducers({
    page: pageReducer,
    persistent: persistentReducer
});

export const store = createStore(reducers);
