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








export const changeTreeSelect = value => ({
    type: 'datafusion/CHANGE_TREE_SELECT',
    value
})
