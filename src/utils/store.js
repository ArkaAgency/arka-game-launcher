import { combineReducers, createStore } from 'redux';
import {pageReducer} from '../features/page';

const reducers = combineReducers({
    page: pageReducer
});

export const store = createStore(reducers);
