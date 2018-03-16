import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    currentStep: 2,
    modalVisible: false,
    modalConfirmLoading: false,
    mappingConfStep: 0,
    mappingSelectData: [[],[],[],[]],
    step1TreeData: [],
    selectTreeNode: [[],[],[],[]]
    // currentSelectTreeName: null
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'datafusionChildDbAdd/TRIGGER_MODAL':
            return state.set('modalVisible', action.isShow);
        case 'datafusionChildDbAdd/HANDLE_MAPPING_STEP':
            const mappingConfStep = state.get('mappingConfStep');
            if (action.status === 'next') return state.set('mappingConfStep', mappingConfStep+1);
            else if (action.status === 'prev') return state.set('mappingConfStep', mappingConfStep-1);
            else if (action.status === 'reset') {
                return state.set('mappingConfStep', 0)
                            .set('mappingSelectData', List([[],[],[],[]]))
                            .set('selectTreeNode', List([[],[],[],[]]));
            }
        case 'datafusionChildDbAdd/GET_MAPPING_DATA_OK':
            return state.set('step1TreeData', fromJS(action.payload));
        case 'datafusionChildDbAdd/CHANGE_SELECT_TREE_NODE':
            return state.setIn(['selectTreeNode', action.arg.step], action.arg.selectNodes);
        case 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA':
            return state.setIn(['mappingSelectData', action.step], state.getIn(['selectTreeNode', action.step]))
        default:
            return state;
    }
};
