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

export const changeTreeSelect = args => ({
    type: 'datafusion/saga/CHANGE_TREE_SELECT',
    args
})

export const handleTagEdit = () => ({
    type: 'datafusion/saga/TAG_EDIT_DATA'
})

export const addNewTag = () => ({
    type: 'datafusion/saga/ADD_NEW_TAG'
})




//normal actions


export const currentComponentLeave = () => ({
    type: 'datafusionChildDbAdd/CURRENT_COMPONENT_LEAVE'
})

export const changeTreeSelectNoData = args => ({
    type: 'datafusion/CHANGE_TREE_SELECT',
    args
})



//db add module actions
export const startMappingConf = () => ({
    type: 'datafusionChildDbAdd/saga/START_MAPPING_CONF',
})

export const mappingConfNext = () => ({
    type: 'datafusionChildDbAdd/saga/MAPPING_CONG_NEXT',
})

export const addNewDbNextStep = args => ({
    type: 'datafusionChildDbAdd/saga/ADD_NEW_DB_NEXT_STEP',
    args
})

export const showExample = args => ({
    type: 'datafusionChildDbAdd/saga/SHOW_EXAMPLE_DATA',
    args
})

export const hideModal2 = args => ({
    type: 'datafusionChildDbAdd/HIDE_MODAL2',
    args
})

export const modal2HandleContent = args => ({
    type: 'datafusionChildDbAdd/MODAL2_HANDLE_CONTENT',
    args
})







//add dml actions
export const triggerModal = isShow => ({
    type: 'datafusionChildDbAdd/TRIGGER_MODAL',
    isShow
})

export const onLoadStep1TreeData = args => ({
    type: 'datafusionChildDbAdd/saga/ONLOAD_STEP0_TREE_DATA',
    args
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
    type: 'datafusionChildDbAdd/saga/HANDLE_MC_SLEECT_CHANGE',
    args
})

//mapping cong step 1
export const addMappingSelect = args => ({
    type: 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA',
    args
})

// export const onLaodTreeData = args => ({
//     type: 'datafusionChildDbAdd/ON_LOAD_TREE_DATA',
//     args
// })


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



//edit db actions
export const getCurrentTagData = args => ({
    type: 'datafusionChildDbEdit/saga/GET_CURRENT_TAG_DATA',
    args
})

export const editTagNext = args => ({
    type: 'datafusionChildDbEdit/EDIT_TAG_NEXT',
    args
})

export const setFieldsValues = args => ({
    type: 'datafusionChildDbEdit/SET_FIELDS_VALUES',
    args
})

export const mergeFieldsValues = args => ({
    type: 'datafusionChildDbEdit/MERGE_FIELDS_VALUES',
    args
})
