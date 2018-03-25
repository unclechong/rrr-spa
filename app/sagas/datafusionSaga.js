import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import datafusionApi from 'app_api/datafusionApi';

function* initDataFusion(){
    const treeData = yield call(getTreeData);
    yield put({type: 'datafusion/CHANGE_TREE_SELECT', args: {index: [treeData.databaseSource[0].key], value: treeData.databaseSource[0].value}});
    const mongoId = treeData.databaseSource[0].value;
    const treeNodeDetail = yield call(datafusionApi.getTreeNodeDetail,{mongoId});
    yield put({type: 'datafusion/SET_TREENODE_DETAIL', payload: treeNodeDetail})
}


function* getTreeData(){
    const treeData = yield call(datafusionApi.getTreeData);
    yield put({type: 'datafusion/GET_TREE_DATA_OK', payload: treeData});
    return treeData
}

function* changeTab({currentTab}){
    // if (currentTab==='taskManage') {
    //     yield put({type: 'datafusionChildDbAdd/CURRENT_COMPONENT_LEAVE'});
    // }
    yield put({type: 'datafusion/CHANGE_TAB', currentTab});
}





//db child saga
function* db_add_startMappingConf(){
    const treeData = yield call(datafusionApi.getMappingDataInStep1);
    yield put({type: 'datafusionChildDbAdd/TRIGGER_MODAL', isShow: true});
    yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA', payload: treeData});
}

function* db_add_mappingConfNext(){
    const mappingSelectData = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingSelectData']).toJS());
    const mappingConfStep = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingConfStep']));
    const nextMappingConfStep = mappingConfStep + 1;
    if (nextMappingConfStep === 1 || nextMappingConfStep === 3) {
        const {value: selectValue, name: selectLabel} = mappingSelectData[mappingConfStep][0];
        const treeData = yield call(datafusionApi.getMappingDataInStep1);

        // 上面步骤条+1
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ nextMappingConfStep + '_TREE_DATA', status: 'next', payload: treeData});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP', status: 'next'});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: selectValue, label: selectLabel}, index: 0}});
    }else if (nextMappingConfStep === 2) {
        const {value: selectValue, name: selectLabel} = mappingSelectData[mappingConfStep][0];
        const selectOptionsData = yield call(datafusionApi.getStep3SelectOptionsData);
        yield put({type: 'datafusionChildDbAdd/INIT_STEP2_SELECT_OPTION', args: {selectOptionsData}});
        const firstOptions = selectOptionsData[0];
        // 先获取上面的关系数据，然后用关系数据中的第一条在去获取下面的treedata
        const treeData = yield call(datafusionApi.getMappingDataInStep1);

        // 上面步骤条+1
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ nextMappingConfStep + '_TREE_DATA', status: 'next', payload: treeData});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP', status: 'next'});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: firstOptions.value, label: firstOptions.label}, index: 0}});
    }

}

function* changeTreeSelect({args}){
    // const treeNodeDetail = yield call(datafusionApi.getTreeNodeDetail,{mongoId:args.value});
    yield put({type: 'datafusion/CHANGE_TREE_SELECT', args})
    // yield put({type: 'datafusion/SET_TREENODE_DETAIL', payload: treeNodeDetail})
}

function* handleTagEdit({args}){
    // console.log(args.id);
    // const selectTreeNodeValue = yield select(state => state.getIn(['datafusion', 'selectTreeNodeValue']));
    const data = yield call(datafusionApi.getDbItemEditInfo, {mongoId: args.id});
    yield put({type: 'datafusionChildDbEdit/GET_CURRENT_TAG_DATA_OK', payload: data})
}

function* watchCreateLesson() {
    yield[
        takeLatest('datafusion/saga/CHANGE_TAB', changeTab),
        takeLatest('datafusion/saga/GET_TREE_DATA', getTreeData),
        takeLatest('datafusion/saga/INIT_DATA_FUSION', initDataFusion),
        takeLatest('datafusionChildDbEdit/saga/GET_CURRENT_TAG_DATA', handleTagEdit),
        // takeLatest('datafusion/saga/TAG_EDIT_DATA', handleTagEdit),

        takeLatest('datafusion/saga/CHANGE_TREE_SELECT', changeTreeSelect),
        takeLatest('datafusionChildDbAdd/saga/START_MAPPING_CONF', db_add_startMappingConf),
        takeLatest('datafusionChildDbAdd/saga/MAPPING_CONG_NEXT', db_add_mappingConfNext)


    ];
}

export default function* datafusionSaga() {
    yield watchCreateLesson()
}
