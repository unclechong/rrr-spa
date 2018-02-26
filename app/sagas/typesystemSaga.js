import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import typesystemApi from 'app_api/typesystemApi';

function* initTypesystem() {
    try {
        const data = yield call(typesystemApi.getTagList);
        yield put({type: 'typesystem/GET_TAGLIST_OK', payload: data.taglist});
        const currentTab = yield select(state => state.get('typesystem').get('currentTab'));
        const {key, label} = data.taglist[currentTab][0];
        yield put({type: 'typesystem/CHANGE_ACTIVE_TAG', tag: {key, label}});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* search({params}) {
    try {
        const data = yield call(typesystemApi.search, params);
        const prevKeyword = yield select(state => state.get('typesystem').get('prevKeyword'));
        yield call(canelCurrentEditHandle, {type: 'typesystem/CHANGE_SEARCH_KEYWORD', searchKeyword: prevKeyword});
        yield put({type: 'typesystem/RESET_TAGLIST'});
        yield put({type: 'typesystem/SEARCH_OK', payload: {list: data.result, keyword: params.keyword}});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* canelCurrentEditHandle(handle) {
    const needCheck = yield select(state => state.get('typesystem').get('activeTag'));
    if (!!needCheck) {
        yield put({type: 'typesystem/TRIGGER_CHECK_MODAL', isShow: true});
        function* handleCancel(){
            if (handle) {
                const flag = yield take('typesystem/TRIGGER_CHECK_MODAL');
                if (!flag.isShow) {
                    yield put(handle);
                }
            }
        }
        const listenCancel = yield fork(handleCancel);
        yield take('typesystem/NEED_CLOSE_EDIT_AREA');
        yield cancel(listenCancel);
        yield put({type: 'typesystem/TRIGGER_CHECK_MODAL', isShow: false});
        yield put({type: 'typesystem/SHOW_ADD_AREA', isShow: false});
    }
}

function* changeTab({currentTab}) {
    yield call(canelCurrentEditHandle);
    const taglist = yield select(state => state.get('typesystem').get('tagList'));
    console.log(taglist);
    const {key, label} = taglist[currentTab][0];
    yield put({type: 'typesystem/CHANGE_ACTIVE_TAG', tag: {key, label}});
    // yield put({type: 'typesystem/RESET_TAGLIST'});
    yield put({type: 'typesystem/CLEAN_SEARCH_LIST'});
    yield put({type: 'typesystem/CHANGE_TAB', currentTab});
}

function* editTag({cb}) {
    yield call(canelCurrentEditHandle);
    const typesystem = yield select(state => state.get('typesystem').toJS());
    const {activeTag, currentTab} = typesystem;
    const params = {type: activeTag, value: currentTab};
    try {
        const data = yield call(typesystemApi.getTagDesc, params);
        yield put({type: 'typesystem/SHOW_ADD_AREA', isShow: true});
        cb(data.result);
    } catch(error){
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* deleteTag() {
    yield call(canelCurrentEditHandle);
    const typesystem = yield select(state => state.get('typesystem').toJS());
    const {activeTag, currentTab} = typesystem;
    const params = {type: activeTag, value: currentTab};
    try {
        const data = yield call(typesystemApi.getTagDesc, params);
        yield put({type: 'typesystem/SHOW_ADD_AREA', isShow: true});
        cb(data.result);
    } catch(error){
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* watchCreateLesson() {
    yield[
        takeLatest('typesystem/saga/GET_TARGET_LIST', initTypesystem),
        takeLatest('typesystem/saga/SEARCH', search),
        takeLatest('typesystem/saga/CHANGE_TAB', changeTab),
        takeLatest('typesystem/saga/EDIT_TAG', editTag),
        takeLatest('typesystem/saga/DELETE_TAG', deleteTag)
    ];
}


export default function* typesystemSaga() {
    yield watchCreateLesson()
}
