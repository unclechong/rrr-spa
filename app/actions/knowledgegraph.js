export const initKnowledgegraph = () => ({
    type: 'knowledgegraph/saga/INIT_PAGE'
})

export const onLoadEntityTreeData = args => ({
    type: 'knowledgegraph/saga/ONLOAD_ENTITY_TREEDATA',
    args
})

export const changeEntityTreeSelect = args => ({
    type: 'knowledgegraph/saga/CHANGE_ENTITY_TREE_SELECT',
    args
})

export const updateEntityBaseInfo = args => ({
    type: 'knowledgegraph/saga/UPDATE_ENTITY_BSAE_INFO',
    args
})

export const addEntityBaseInfo = args => ({
    type: 'knowledgegraph/saga/ADD_ENTITY_BSAE_INFO',
    args
})

export const deleteAddEntity = args => ({
    type: 'knowledgegraph/saga/DELETE_ENTITY',
    args
})




export const enterAddEntity = () => {
    return (dispatch,getState) => {
        dispatch(resetFieldsValues());
        dispatch({type: 'knowledgegraph/ENTER_ADD_ENTITY'})
    }
}

export const mergeFieldsValues = args => ({
    type: 'knowledgegraph/MERGE_FIELDS_VALUES',
    args
})

export const setFieldsValues = args => ({
    type: 'knowledgegraph/SET_FIELDS_VALUES',
    args
})

export const resetFieldsValues = args => ({
    type: 'knowledgegraph/RESET_FIELDS_VALUES',
    args
})
