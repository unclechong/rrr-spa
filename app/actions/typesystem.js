import { fromJS } from 'immutable';


export const changeActiveTag = tag => ({
    type:'CHANGE_ACTIVE_TAG',
    tag
})

export const changeTab = currentTab => {
    return (dispatch,getState) => {
        dispatch(resetTaglist())
        dispatch({
            type:'CHANGE_TAB',
            currentTab
        })
    }
}

export const showAddArea = isShow => ({
    type:'SHOW_ADD_AREA',
    isShow
})

export const resetTaglist = () => ({
    type:'typesystem/RESET_TAGLIST'
})

export const gettargetlist = () => ({
    type:'typesystem/saga/GET_TARGET_LIST'
})

export const cleanSearch = () => {
    return (dispatch,getState) => {
        dispatch(resetTaglist())
        dispatch({
            type:'typesystem/CLEAN_SEARCH_LIST'
        })
    }
}

export const search = params => ({
    type:'typesystem/saga/SEARCH',
    params
})
