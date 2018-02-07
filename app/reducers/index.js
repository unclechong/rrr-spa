import { combineReducers } from 'redux-immutable';
import reduce from './reduce_1';


const rootReducer = combineReducers({
    reduce: reduce
});

export default rootReducer;
