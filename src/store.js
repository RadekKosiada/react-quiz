import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//since we have a file index.js in reducers we dont need to specify the name of it;
import rootReducer from './reducers';
const initialState = {};

const middleware = [thunk];

const store = createStore(tootReducer, initialState, applyMiddleware(...middleware));

export default store;