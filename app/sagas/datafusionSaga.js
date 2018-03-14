import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import datafusionApi from 'app_api/datafusionApi';

function* getTreeData({currentTab}){
    const treeData = yield call(datafusionApi.getTreeData);
    yield put({type: 'datafusion/GET_TREE_DATA_OK', payload: treeData});
}

function* changeTab({currentTab}){
    yield put({type: 'datafusion/CHANGE_TAB', currentTab});
}

function* watchCreateLesson() {
    yield[
        takeLatest('datafusion/saga/CHANGE_TAB', changeTab),
        takeLatest('datafusion/saga/GET_TREE_DATA', getTreeData),
    ];
}

export default function* datafusionSaga() {
    yield watchCreateLesson()
}
