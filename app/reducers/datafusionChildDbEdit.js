import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    tagEditData: {}
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'datafusionChildDbEdit/GET_CURRENT_TAG_DATA_OK' :
            return state.set('tagEditData', action.payload)
        default:
            return initialState;
    }
};
