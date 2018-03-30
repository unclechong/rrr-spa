import { combineReducers } from 'redux-immutable';
import typesystem from './typesystem';
import datafusion from './datafusion';
import datafusionChildDbAdd from './datafusionChildDbAdd';
import datafusionChildDbEdit from './datafusionChildDbEdit';
import datafusionChildDmlAdd from './datafusionChildDmlAdd';
import datafusionChildDmlEdit from './datafusionChildDmlEdit';
import knowledgegraph from './knowledgegraph';

const rootReducer = combineReducers({
    typesystem: typesystem,
    datafusion: datafusion,
    datafusionChildDbAdd: datafusionChildDbAdd,
    datafusionChildDbEdit: datafusionChildDbEdit,
    datafusionChildDmlAdd: datafusionChildDmlAdd,
    datafusionChildDmlEdit: datafusionChildDmlEdit,
    knowledgegraph: knowledgegraph
});

export default rootReducer;
