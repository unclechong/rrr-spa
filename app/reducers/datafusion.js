import { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    currentTab: 'dataSource',
    treeData: [],
    treeSelectValue: [],
    selectTreeNodeValue: null,
    treeNodeDetail: [],
    tagEditData: {},
    formData: {step1:{},step2:{},step3:{}}
    // currentSelectTreeName: null
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'datafusion/CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        case 'datafusion/GET_TREE_DATA_OK':
            return state.set('treeData', action.payload);
        case 'datafusion/CHANGE_TREE_SELECT':
            return state.set('treeSelectValue', action.args.index)
                        .set('selectTreeNodeValue', action.args.value);
        case 'datafusionChildDbEdit/MERGE_FIELDS_VALUES':
            return state.setIn(['formData', action.args.index], state.get('formData').merge(action.args.data))
        case 'datafusionChildDbEdit/SET_FIELDS_VALUES':
            return state.setIn(['formData', action.args.index], fromJS(action.args.data))
        case 'datafusion/TAG_EDIT_DATA':
            return state.set('tagEditData', action.payload)
        case 'datafusion/SET_TREENODE_DETAIL':
            return state.set('treeNodeDetail', action.payload)
                        // .set('currentSelectTreeName', action.type);
        default:
            return state;
    }
};
