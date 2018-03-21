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


export const currentComponentLeave = () => ({
    type: 'datafusionChildDbAdd/CURRENT_COMPONENT_LEAVE'
})



//db add module actions
export const startMappingConf = () => ({
    type: 'datafusionChildDbAdd/saga/START_MAPPING_CONF',
})

export const mappingConfNext = () => ({
    type: 'datafusionChildDbAdd/saga/MAPPING_CONG_NEXT',
})

export const triggerModal = isShow => ({
    type: 'datafusionChildDbAdd/TRIGGER_MODAL',
    isShow
})

//add dml actions
export const addNewDbNextStep = () => ({
    type: 'datafusionChildDbAdd/ADD_NEW_DB_NEXT_STEP'
})

export const onLoadStep1TreeData = treeData => ({
    type: 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA',
    payload:treeData
})

export const handleMappingStep = status => ({
    type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP',
    status
})

export const changeSelectTreeNode = args => ({
    type: 'datafusionChildDbAdd/CHANGE_SELECT_TREE_NODE',
    args
})

export const handleMCSelectChange = args => ({
    type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE',
    args
})

//mapping cong step 1
export const addMappingSelect = args => ({
    type: 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA',
    args
})

//mapping cong step 2,3,4
export const addMappingSelectOther = args => ({
    type: 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA_OTHER',
    args
})


export const cleanMappingSelectData = args => ({
    type: 'datafusionChildDbAdd/CLEAN_MAPPING_SELECT_DATA',
    args
})

export const cleanMCSelectDataStepOther = () => ({
    type: 'datafusionChildDbAdd/CLEAN_MAPPING_SELECT_DATA_OTHER'
})


export const cancelMappingConf = () => {
    return (dispatch,getState) => {
        dispatch(handleMappingStep('reset'));
        dispatch(triggerModal(false));
    }
}




//add dml actions
export const addNewDmlNextStep = () => ({
    type: 'datafusionChildDbAdd/ADD_NEW_DML_NEXT_STEP'
})
