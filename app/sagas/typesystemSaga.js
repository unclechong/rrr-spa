import {call, put} from 'redux-saga/effects';
import typesystemApi from 'app_api/typesystemApi';

export function* typesystemSaga() {
    try {
        //Get User Info
        const user = yield call(typesystemApi.gettargetlist);

        //Tell the store to save the user Info also activate loadDashboardSecuenced
        yield put({type: 'FETCH_USER_SUCCESS', payload: user});

    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}
