import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    currentStep: 0,
    newTagData: [],
    modalVisible: false,
    modalData: {},
    modalCurrentConent:0
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'datafusionChildDmlAdd/ADD_NEW_DML_NEXT_STEP':
            return state.set('currentStep', state.get('currentStep')+1)
                        .setIn(['newTagData', action.args.index], fromJS(action.args.data))
        case 'datafusionChildDmlAdd/GET_EXAMPLE_DATA_OK':
            return state.set('modalVisible', true)
                        .set('modalData', action.payload)
        case 'datafusionChildDmlAdd/HIDE_EXAMPLE_DATA':
            return state.set('modalVisible', false)
                        .set('modalCurrentConent', 0)
        case 'datafusionChildDmlAdd/MODAL_HANDLE_CONTENT':
            let currentIndex = state.get('modalCurrentConent');
            if (action.args.status === 'next') {
                currentIndex === state.get('modalData').length-1?currentIndex:++currentIndex
            }else if(action.args.status === 'prev'){
                currentIndex === 0?0:--currentIndex
            }
            return state.set('modalCurrentConent', currentIndex)
        case 'datafusionChildDmlAdd/CURRENT_COMPONENT_LEAVE':
            return initialState;
        default:
            return state;
    }
};
