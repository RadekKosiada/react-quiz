import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {};

const middleware = [thunk];

const store = createStore(tootReducer, initialState, applyMiddleware(...middleware));

export default store;