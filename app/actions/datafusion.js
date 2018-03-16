export const initDataFusion = () => ({
    type: 'datafusion/saga/INIT_DATA_FUSION'
})

export const changeTab = currentTab => ({
    type: 'datafusion/saga/CHANGE_TAB',
    currentTab
})

export const getTreeData = () => ({
    type: 'datafusion/saga/GET_TREE_DATA'
})


//normal actions
export const changeTreeSelect = value => ({
    type: 'datafusion/CHANGE_TREE_SELECT',
    value
})






//db add module actions
export const startMappingConf = () => ({
    type: 'datafusionChildDbAdd/saga/START_MAPPING_CONF',
})


export const triggerModal = isShow => ({
    type: 'datafusionChildDbAdd/TRIGGER_MODAL',
    isShow
})



export const handleMappingStep = status => ({
    type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP',
    status
})

export const changeSelectTreeNode = arg => ({
    type: 'datafusionChildDbAdd/CHANGE_SELECT_TREE_NODE',
    arg
})

export const addMappingSelect = step => ({
    type: 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA',
    step
})


export const cancelMappingConf = () => {
    return (dispatch,getState) => {
        dispatch(triggerModal(false));
        dispatch(handleMappingStep('reset'));
    }
}
