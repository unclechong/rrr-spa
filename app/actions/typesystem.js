import { fromJS } from 'immutable';

//register saga
export const changeTab = currentTab => ({
    type:'typesystem/saga/CHANGE_TAB',
    currentTab
})

export const gettargetlist = () => ({
    type:'typesystem/saga/GET_TARGET_LIST'
})

export const search = params => ({
    type:'typesystem/saga/SEARCH',
    params
})

export const showEditArea = cb => ({
    type:'typesystem/saga/EDIT_TAG',
    cb
})

export const deleteActiveTag = () => ({
    type:'typesystem/saga/DELETE_TAG'
})





//normal actions
export const changeActiveTag = tag => ({
    type:'typesystem/CHANGE_ACTIVE_TAG',
    tag
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


// export const cleanSearch = () => {
//     return (dispatch,getState) => {
//         dispatch(resetTaglist());
//         dispatch({
//             type:'typesystem/CLEAN_SEARCH_LIST'
//         })
//     }
// }
