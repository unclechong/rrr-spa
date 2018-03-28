import { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    currentTab: 'dataSource',
    treeData: [],
    treeSelectValue: [],
    selectTreeNodeValue: null,
    treeNodeDetail: [],
    tagEditData: {},
    formData: {step1:{},step2:{},step3:{}},
    activeTag: '非结构化数据',
    taskList:[]
    // currentSelectTreeName: null
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'datafusion/CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        case 'datafusion/GET_TREE_DATA_OK':
            return state.set('treeData', fromJS(action.payload));
        case 'datafusion/CHANGE_TREE_SELECT':
            return state.set('treeSelectValue', action.args.index)
                        .set('selectTreeNodeValue', action.args.value);
        case 'datafusion/MERGE_TREE_DATA':
            return state.set('treeData', fromJS(action.payload));
        case 'datafusionChildDbEdit/MERGE_FIELDS_VALUES':
            return state.setIn(['formData', action.args.index], state.get('formData').merge(action.args.data))
        case 'datafusionChildDbEdit/SET_FIELDS_VALUES':
            return state.setIn(['formData', action.args.index], fromJS(action.args.data))
        case 'datafusion/TAG_EDIT_DATA':
            return state.set('tagEditData', action.payload)
        case 'datafusion/SET_TREENODE_DETAIL':
            return state.set('treeNodeDetail', action.payload)
                        // .set('currentSelectTreeName', action.type);
        // case 'datafusionChildTaskManager/TASK_MANAGER_ONCHANGE':
        //     return state.set('activeTag', action.value)
        case 'datafusionChildTaskManager/GET_TASK_MANAGE_LIST_OK':
            return state.set('taskList', fromJS(action.payload.data))
                        .set('activeTag', action.payload.value)
            break;
        default:
            return state;
    }
};
