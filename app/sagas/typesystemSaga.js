import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork} from 'redux-saga/effects';
import typesystemApi from 'app_api/typesystemApi';

function* initTypesystem() {
    try {
        const user = yield call(typesystemApi.gettargetlist);
        yield put({type: 'FETCH_USER_SUCCESS', payload: user});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* sagaTakeTest() {
    try {
        yield take('GET_TARGET_LIST');
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* watchCreateLesson() {
    yield[
        takeEvery('GET_TARGET_LIST', initTypesystem),
        fork(sagaTakeTest)
    ];
}


export default function* typesystemSaga() {
    yield watchCreateLesson()
}
