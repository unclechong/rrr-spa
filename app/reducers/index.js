import { combineReducers } from 'redux-immutable';
import typesystem from './typesystem';
import datafusion from './datafusion';
import datafusionChildDbAdd from './datafusionChildDbAdd';
import datafusionChildDmlAdd from './datafusionChildDmlAdd';

const rootReducer = combineReducers({
    typesystem: typesystem,
    datafusion: datafusion,
    datafusionChildDbAdd: datafusionChildDbAdd,
    datafusionChildDmlAdd: datafusionChildDmlAdd
});

export default rootReducer;
