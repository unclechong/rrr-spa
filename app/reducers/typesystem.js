import Immutable, { fromJS ,Map} from 'immutable';

const initialState = fromJS({
    activeTag: null,
    activeTagName: null,
    currentTab: 'entity',
    // showAddArea:false,
    tagList:{},
    isSearch:false,
    searchResultList:[],
    checkModal:false,
    searchKeyword:'',
    prevKeyword:'',
    formData:{username:'',desc:'',img444:''}
});

export default (state = initialState, action) => {

    switch (action.type) {
        case 'typesystem/CHANGE_TAB':
            return state.set('currentTab', action.currentTab)
        case 'typesystem/CHANGE_ACTIVE_TAG':
            return state.set('activeTag', action.tag.key).set('activeTagName', action.tag.label);
        // case 'typesystem/SHOW_ADD_AREA':
        //     return state.set('showAddArea', action.isShow);
        case 'typesystem/CLEAN_SEARCH_LIST':
            return state.set('isSearch', false)
                        .set('searchKeyword', '')
                        .set('prevKeyword', '')
                        .set('searchResultList', []);
        case 'typesystem/RESET_TAGLIST':
            return state.set('activeTag', null)
                        .set('activeTagName', null);
        case 'typesystem/GET_TAGLIST_OK':
            return state.set('tagList', action.payload);
        case 'typesystem/CHANGE_SEARCH_KEYWORD':
            return state.set('searchKeyword', action.searchKeyword);
        case 'typesystem/SEARCH_OK':
            return state.set('isSearch', true)
                        .set('prevKeyword', action.payload.keyword)
                        .set('searchResultList', action.payload.list);
        case 'typesystem/TRIGGER_CHECK_MODAL':
            return state.set('checkModal', action.isShow);
        case 'typesystem/SET_EDIT_VALUE':
            return state.set('formData', fromJS(action.payload));
        case 'typesystem/CHANGE_FIELDS':
            const {key, value} = action.data;
            return state.setIn(['formData', key], value);
        case 'typesystem/CANCEL_SELECTED_TAG':
            const newFormData = state.get('formData').map(x => '');
            return state.set('formData',newFormData);
        default:
            return state;
    }

};
