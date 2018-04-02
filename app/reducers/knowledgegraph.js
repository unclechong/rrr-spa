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
    currentEventTagDetail: []
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
            return state.set('eventActiveTag', action.args.activeTag);
        case 'knowledgegraph/GET_EVENT_TAG_DETAIL_OK':
            return state.set('currentEventTagDetail', fromJS(action.payload));
        case 'knowledgegraph/CHANGE_ENTITY_TREE_SELECT':
            return state.set('entityTreeSelectInfo', fromJS(action.args.entityTreeSelectInfo));
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
            return state.set('currentFormIsAdd', true);
        case 'knowledgegraph/UPDATE_ENTITY_SUCCESS':
            return state.set('currentFormIsUpdate', false);
        case 'knowledgegraph/ADD_ENTITY_SUCCESS':
            return state.set('formData', state.get('formData').map(x => ({value: undefined})))
        case 'knowledgegraph/DELETE_ENTITY_SUCCESS':
            return state.set('formData', state.get('formData').map(x => ({value: undefined})))
                        .set('currentFormIsAdd', true);
        default:
            return state;
    }
};
