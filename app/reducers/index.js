import { combineReducers } from 'redux-immutable';
import typesystem from './typesystem';
import datafusion from './datafusion';
import datafusionChildDbAdd from './datafusionChildDbAdd';
import datafusionChildDbEdit from './datafusionChildDbEdit';
import datafusionChildDmlAdd from './datafusionChildDmlAdd';
import datafusionChildDmlEdit from './datafusionChildDmlEdit';

const rootReducer = combineReducers({
    typesystem: typesystem,
    datafusion: datafusion,
    datafusionChildDbAdd: datafusionChildDbAdd,
    datafusionChildDbEdit: datafusionChildDbEdit,
    datafusionChildDmlAdd: datafusionChildDmlAdd,
    datafusionChildDmlEdit: datafusionChildDmlEdit
});

export default rootReducer;
