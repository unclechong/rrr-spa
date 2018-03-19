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
    yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA', payload: treeData});
}

function* db_add_mappingConfNext(){
    const mappingSelectData = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingSelectData']).toJS());
    const mappingConfStep = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingConfStep']));
    const {value: selectValue, name: selectLabel} = mappingSelectData[mappingConfStep][0];
    const treeData = yield call(datafusionApi.getMappingDataInStep1);

    // 上面步骤条+1
    yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ (mappingConfStep+1) + '_TREE_DATA', status: 'next', payload: treeData});
    yield put({type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP', status: 'next'});
    yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: selectValue, label: selectLabel}, index: 0}});
}

function* watchCreateLesson() {
    yield[
        takeLatest('datafusion/saga/CHANGE_TAB', changeTab),
        takeLatest('datafusion/saga/GET_TREE_DATA', getTreeData),
        takeLatest('datafusion/saga/INIT_DATA_FUSION', initDataFusion),
        takeLatest('datafusionChildDbAdd/saga/START_MAPPING_CONF', db_add_startMappingConf),
        takeLatest('datafusionChildDbAdd/saga/MAPPING_CONG_NEXT', db_add_mappingConfNext)


    ];
}

export default function* datafusionSaga() {
    yield watchCreateLesson()
}
