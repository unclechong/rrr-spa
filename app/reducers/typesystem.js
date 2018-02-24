import Immutable ,{ fromJS } from 'immutable';

const initialState = fromJS({
    activeTag: null,
    activeTagName: null,
    currentTab: 'entity',
    showAddArea:false,
    tagList:{},
    isSearch:false,
    searchResultList:[]
});


export default (state = initialState, action) => {

    switch (action.type) {
        case 'CHANGE_ACTIVE_TAG':
            // if (state.get('activeTag')===action.tag.key)
            // return state.set('activeTag', null).set('activeTagName', null);
            return state.set('activeTag', action.tag.key).set('activeTagName', action.tag.label);
        case 'CHANGE_TAB':
            return state.set('currentTab', action.currentTab)
                        .set('isSearch', false)
                        .set('searchResultList', [])
        case 'SHOW_ADD_AREA':
            return state.set('showAddArea', action.isShow);
        case 'typesystem/CLEAN_SEARCH_LIST':
            return state.set('isSearch', false)
                        .set('searchResultList', []);
        case 'typesystem/RESET_TAGLIST':
        console.log(111);
            return state.set('activeTag', null)
                        .set('activeTagName', null);
        case 'typesystem/GET_TAGLIST_OK':
            return state.set('tagList', action.payload);
        case 'typesystem/SEARCH_OK':
            return state.set('isSearch', true)
                        .set('searchResultList', action.payload);
        default:
            return state;
    }

};
