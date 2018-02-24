import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork} from 'redux-saga/effects';
import typesystemApi from 'app_api/typesystemApi';

function* initTypesystem() {
    try {
        const data = yield call(typesystemApi.getTagList);
        yield put({type: 'typesystem/GET_TAGLIST_OK', payload: data.taglist});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* search({params}) {
    try {
        const data = yield call(typesystemApi.search, params);
        yield put({type: 'typesystem/RESET_TAGLIST'});
        yield put({type: 'typesystem/SEARCH_OK', payload: data.result});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* watchCreateLesson() {
    yield[
        takeLatest('typesystem/saga/GET_TARGET_LIST', initTypesystem),
        takeLatest('typesystem/saga/SEARCH', search)
    ];
}


export default function* typesystemSaga() {
    yield watchCreateLesson()
}
