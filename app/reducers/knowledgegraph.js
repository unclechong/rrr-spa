import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    currentTab: 'entity',
    entityTreeData: [],
    entityTreeSelectInfo: {},
    formData: {},
    currentFormIsUpdate: false,
    currentFormIsAdd: false,
    eventTagList: [],
    eventActiveTag: null,
    currentEventTagDetail: [],
    showInstance: false,
    instanceTableData: [],
    showEntityPropConf: false,
    renderType: 'entity'
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'knowledgegraph/CHANGE_TAB':
            return state.set('currentTab', action.args.currentTab);
        case 'knowledgegraph/GET_ENTITY_TREEDATA_OK':
            return state.set('entityTreeData', fromJS(action.payload));
        case 'knowledgegraph/GET_TAGLIST_OK':
            return state.set('eventTagList', fromJS(action.payload));
        case 'knowledgegraph/CHANGE_TAGLIST_ACTIVETAG':
            return state.set('eventActiveTag', action.args.activeTag)
        case 'knowledgegraph/GET_EVENT_TAG_DETAIL_OK':
            return state.set('currentEventTagDetail', fromJS(action.payload));
        case 'knowledgegraph/CHANGE_ENTITY_TREE_SELECT':
            return state.set('entityTreeSelectInfo', fromJS(action.args.entityTreeSelectInfo))
                        .set('showInstance', false)
                        .set('instanceTableData', List())
                        .set('showEntityPropConf', false)
        case 'knowledgegraph/MERGE_FIELDS_VALUES':
            return state.set('formData', state.get('formData').merge(action.args))
                        .set('currentFormIsUpdate', true);
        case 'knowledgegraph/SET_FIELDS_VALUES':
            return state.set('formData', fromJS(action.payload))
                        .set('currentFormIsUpdate', false)
                        .set('currentFormIsAdd', false);
        case 'knowledgegraph/RESET_FIELDS_VALUES':
            const newFormData = state.get('formData').map(x => ({value: undefined}));
            return state.set('formData', newFormData)
        case 'knowledgegraph/ENTER_ADD_ENTITY':
            return state.set('currentFormIsAdd', true)
                        .set('showEntityPropConf', false)
        case 'knowledgegraph/UPDATE_ENTITY_SUCCESS':
            return state.set('currentFormIsUpdate', false)
                        .setIn(['entityTreeSelectInfo','entityTreeSlecetLabel'], action.payload)
        case 'knowledgegraph/ADD_ENTITY_SUCCESS':
            return state.set('formData', state.get('formData').map(x => ({value: undefined})))
        case 'knowledgegraph/DELETE_ENTITY_SUCCESS':
            return state.set('formData', state.get('formData').map(x => ({value: undefined})))
                        .set('currentFormIsAdd', false)
                        .set('entityTreeSelectInfo', Map())
        case 'knowledgegraph/ENTRY_SHOW_INSTANCE':
            return state.set('showInstance', action.args.key)
                        .set('instanceTableData', action.args.data)
                        .set('showEntityPropConf', false)
        case 'knowledgegraph/SHOW_ENTITY_PROP_CONF':
            return state.set('showEntityPropConf', true)
        case 'knowledgegraph/CHANGE_RENDERTYPE':
            return state.set('renderType', action.payload)
        default:
            return state;
    }
};
