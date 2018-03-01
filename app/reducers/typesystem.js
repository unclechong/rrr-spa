import Immutable, { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    activeTag: null,
    activeTagName: null,
    currentTab: 'entityType',
    currentTagIndex: 0,
    tagList: {},
    isSearch: false,
    searchResultList: [],
    checkModal: false,
    searchKeyword: '',
    prevKeyword: '',
    formData: {},
    lastFormData: {},
    currentFormIsUpdate: false
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'typesystem/CHANGE_TAB':
            return state.set('currentTab', action.currentTab);
        case 'typesystem/CHANGE_ACTIVE_TAG':
            const {tag: {value, label, index}} = action;
            return state.set('activeTag', value)
                        .set('activeTagName', label)
                        .set('currentTagIndex', index);
        case 'typesystem/CLEAN_SEARCH_LIST':
            return state.set('isSearch', false)
                        .set('searchKeyword', '')
                        .set('prevKeyword', '')
                        .set('searchResultList', List([]));
        case 'typesystem/RESET_TAGLIST':
            return state.set('activeTag', null)
                        .set('activeTagName', null)
                        .set('currentTagIndex', null);
        case 'typesystem/GET_TAGLIST_OK':
            return state.set('tagList', Map(action.payload));
        case 'typesystem/CHANGE_SEARCH_KEYWORD':
            return state.set('searchKeyword', action.searchKeyword);
        case 'typesystem/SEARCH_OK':
            return state.set('isSearch', true)
                        .set('prevKeyword', action.payload.keyword)
                        .set('searchResultList', List(action.payload.list));
        case 'typesystem/TRIGGER_CHECK_MODAL':
            return state.set('checkModal', action.isShow);
        case 'typesystem/SET_EDIT_VALUE':
            return state.set('lastFormData', fromJS(action.payload))
                        .set('currentFormIsUpdate', false)
                        .set('formData', fromJS(action.payload));
        case 'typesystem/MERGE_FIELDS_VALUES':
            return state.set('formData', state.get('formData').merge(action.data))
                        .set('currentFormIsUpdate', true);
        case 'typesystem/CANCEL_SELECTED_TAG':
            return state.set('lastFormData', Map({}))
                        .set('currentFormIsUpdate', false);
        case 'typesystem/UPADTE_TAGLIST':
            const {handle, tab, ...rest} = action;
            if (handle === 'delete') return state.updateIn(['tagList', tab], x => {
                x.splice(rest.index, 1);
                return x
            })
            else if (handle === 'add') return state.updateIn(['tagList', tab], x => {
                x.push({key: rest.value, value: rest.value, label: rest.label})
                return x
            })
            else if (handle === 'edit') return state.updateIn(['tagList', tab], x => {
                x[rest.index].label = rest.label;
                return x
            });
        case 'typesystem/RESET_FIELD_VALUES':
            const newFormData = state.get('formData').map(x => ({value: undefined}));
            return state.set('formData', newFormData)
                        .set('currentFormIsUpdate', true);
        default:
            return state;
    }
};
