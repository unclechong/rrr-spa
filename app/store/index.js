import {createStore, compose, applyMiddleware} from 'redux';
import reducer from '../reducers/index.js';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
    const store = createStore(reducer,compose(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSaga);
    return store;
}

export default configureStore
