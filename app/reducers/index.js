import { combineReducers } from 'redux-immutable';
import typesystem from './typesystem';
import datafusion from './datafusion';
import datafusionChildDbAdd from './datafusionChildDbAdd';
import datafusionChildDmlAdd from './datafusionChildDmlAdd';
import datafusionChildDbEdit from './datafusionChildDbEdit';

const rootReducer = combineReducers({
    typesystem: typesystem,
    datafusion: datafusion,
    datafusionChildDbAdd: datafusionChildDbAdd,
    datafusionChildDmlAdd: datafusionChildDmlAdd,
    datafusionChildDbEdit: datafusionChildDbEdit
});

export default rootReducer;
