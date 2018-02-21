import { combineReducers } from 'redux-immutable';
import typesystem from './typesystem';


const rootReducer = combineReducers({
    typesystem: typesystem
});

export default rootReducer;
