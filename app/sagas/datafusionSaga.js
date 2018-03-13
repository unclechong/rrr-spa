import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
// import typesystemApi from 'app_api/typesystemApi';

function* changeTab({currentTab}){
    yield put({type: 'datafusion/CHANGE_TAB', currentTab});
}

function* watchCreateLesson() {
    yield[
        takeLatest('datafusion/saga/CHANGE_TAB', changeTab)
    ];
}

export default function* datafusionSaga() {
    yield watchCreateLesson()
}
