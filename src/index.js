import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// Step 1: npm install redux-saga
// Step 2: import createSagaMiddleware
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
// Step 8: Import axios, takeEvery and put
import axios from 'axios';
// put is dispatch (they do the same thing)
import { takeEvery, put } from 'redux-saga/effects';

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
}; 
// Make a GET request and pass the data to redux
function* fetchElements() {
    try {
        // Wait for a server response...
        const elements = yield axios.get('/api/element');
        // After we get a response, dispatch an action
        yield put({ type: 'SET_ELEMENTS', payload: elements.data });
    } catch (error) {
        console.log(`error in fetchElements: ${error}`);
        alert('Something went wrong.');
    }
}

function* postElement(action) {
    try {
        yield axios.post('/api/element', action.payload);
        // Call the GET
        yield put({ type: 'FETCH_ELEMENTS' });
        // We can pass functions through actions
        action.setNewElement('');
    } catch (error) {
        console.log(`error in postElement`);
        alert('Something went wrong');
    }
}

// Step 3: Create a root saga
// this is the saga that will watch for actions
function* rootSaga() {
    //! 'FETCH_ELEMENTS' is our action type.
    //! DO NOT USE the same action as the reducer
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('ADD_ELEMENT', postElement);
    // More sagas go here
}

// Step 4: create saga middleware
const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    // Step 5: add middleware to redux
    applyMiddleware(sagaMiddleware, logger),
);

// Step 6: add our root saga to our middleware
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
