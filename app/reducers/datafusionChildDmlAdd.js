import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    currentStep: 0
});

export default (state = initialState, action) => {
    const currentStep = state.get('currentStep');
    switch (action.type) {
        case 'datafusionChildDbAdd/ADD_NEW_DML_NEXT_STEP' :
            return state.set('currentStep', currentStep + 1)
        case 'datafusionChildDbAdd/CURRENT_COMPONENT_LEAVE' :
            return state.set('currentStep', 0)
        default:
            return initialState;
    }
};
