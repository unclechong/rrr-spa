import { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    currentTab: 'dataSource',
    treeData: [],
    treeSelectValue: [],
    // currentSelectTreeName: null
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'datafusion/CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        case 'datafusion/GET_TREE_DATA_OK':
            return state.set('treeData', action.payload);
        case 'datafusion/CHANGE_TREE_SELECT':
            return state.set('treeSelectValue', action.value)
                        // .set('currentSelectTreeName', action.type);
        default:
            return state;
    }
};
