import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import datafusionApi from 'app_api/datafusionApi';

function* initDataFusion(){
    const treeData = yield call(getTreeData);
    yield put({type: 'datafusion/CHANGE_TREE_SELECT', value: [treeData.databaseSource[0].key]})
}


function* getTreeData(){
    const treeData = yield call(datafusionApi.getTreeData);
    yield put({type: 'datafusion/GET_TREE_DATA_OK', payload: treeData});
    return treeData
}

function* changeTab({currentTab}){
    yield put({type: 'datafusion/CHANGE_TAB', currentTab});
}





//db child saga
function* db_add_startMappingConf(){
    const treeData = yield call(datafusionApi.getMappingDataInStep1);
    yield put({type: 'datafusionChildDbAdd/TRIGGER_MODAL', isShow: true});
    yield put({type: 'datafusionChildDbAdd/GET_MAPPING_DATA_OK', payload: treeData});
}

function* watchCreateLesson() {
    yield[
        takeLatest('datafusion/saga/CHANGE_TAB', changeTab),
        takeLatest('datafusion/saga/GET_TREE_DATA', getTreeData),
        takeLatest('datafusion/saga/INIT_DATA_FUSION', initDataFusion),
        takeLatest('datafusionChildDbAdd/saga/START_MAPPING_CONF', db_add_startMappingConf)

    ];
}

export default function* datafusionSaga() {
    yield watchCreateLesson()
}
