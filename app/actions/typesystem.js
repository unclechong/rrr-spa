import { fromJS } from 'immutable';

//register saga
export const changeTab = currentTab => ({
    type: 'typesystem/saga/CHANGE_TAB',
    currentTab
})

export const gettargetlist = () => ({
    type: 'typesystem/saga/GET_TARGET_LIST'
})

export const search = params => ({
    type: 'typesystem/saga/SEARCH',
    params
})

export const editTag = tag => ({
    type: 'typesystem/saga/EDIT_TAG',
    tag
})

export const deleteActiveTag = (index, CB) => ({
    type: 'typesystem/saga/DELETE_TAG',
    index,
    CB
})

export const addTag = (fieldvalues, CB) => ({
    type: 'typesystem/saga/ADD_TAG',
    fieldvalues,
    CB
})



//normal actions
export const changeActiveTag = tag => ({
    type: 'typesystem/CHANGE_ACTIVE_TAG',
    tag
})

export const mergeFieldsValues = data => ({
    type: 'typesystem/MERGE_FIELDS_VALUES',
    data
})

export const changedFields = data => ({
    type: 'typesystem/CHANGE_FIELDS_VALUES',
    data
})

// export const showAddArea = isShow => ({
//     type:'typesystem/SHOW_ADD_AREA',
//     isShow
// })

export const resetTaglist = () => ({
    type:'typesystem/RESET_TAGLIST'
})

export const changeSearchKeyword = searchKeyword => ({
    type:'typesystem/CHANGE_SEARCH_KEYWORD',
    searchKeyword
})

export const needCloseEditArea = () => ({
    type:'typesystem/NEED_CLOSE_EDIT_AREA'
})

export const triggerCheckModal = isShow => ({
    type:'typesystem/TRIGGER_CHECK_MODAL',
    isShow
})

export const cancelSelectedTag = () => {
    return (dispatch,getState) => {
        dispatch(resetTaglist());
        dispatch(cleanFormValues());
    }
}

export const cleanFormValues = () => ({
    type:'typesystem/RESET_FIELD_VALUES'
})





// export const cleanSearch = () => {
//     return (dispatch,getState) => {
//         dispatch(resetTaglist());
//         dispatch({
//             type:'typesystem/CLEAN_SEARCH_LIST'
//         })
//     }
// }
