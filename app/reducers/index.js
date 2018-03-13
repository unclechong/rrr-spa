import { combineReducers } from 'redux-immutable';
import typesystem from './typesystem';
import datafusion from './datafusion';

const rootReducer = combineReducers({
    typesystem: typesystem,
    datafusion: datafusion
});

export default rootReducer;
