import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    tagEditData: {},
    editStep: 0,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'datafusionChildDmlEdit/GET_CURRENT_TAG_DATA_OK' :
            return state.set('tagEditData', action.payload)
                        .set('editStep', 1)
        case 'datafusionChildDmlEdit/EDIT_TAG_NEXT' :
            return state.set('editStep', action.args.step)
        default:
            return state;
    }
};
