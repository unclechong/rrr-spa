import { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    currentTab: 'dataSource',
    treeData: []
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'datafusion/CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        case 'datafusion/GET_TREE_DATA_OK':
            return state.set('treeData', action.payload);
        default:
            return state;
    }
};
