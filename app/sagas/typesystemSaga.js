import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import typesystemApi from 'app_api/typesystemApi';

function* initTypesystem() {
    try {
        const taglist = yield call(typesystemApi.getTagList);
        yield put({type: 'typesystem/GET_TAGLIST_OK', payload: taglist});
        const currentTab = yield select(state => state.get('typesystem').get('currentTab'));
        const tag = taglist[currentTab][0];
        yield call(handleEditTag, tag);
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
        const tag = data.result[0];
        yield call(handleEditTag, tag);
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* canelCurrentEditHandle(handle) {
    const needCheck = yield select(state => state.get('typesystem').get('currentFormIsUpdate'));
    if (needCheck) {
        yield put({type: 'typesystem/TRIGGER_CHECK_MODAL', isShow: true});
        // function* handleCancel(){
        //     if (handle) {
        //         const flag = yield take('typesystem/TRIGGER_CHECK_MODAL');
        //         if (!flag.isShow) {
        //             yield put(handle);
        //         }
        //     }
        // }
        // const listenCancel = yield fork(handleCancel);
        const action = yield take('typesystem/NEED_CLOSE_EDIT_AREA');
        yield put({type: 'typesystem/TRIGGER_CHECK_MODAL', isShow: false});
        // yield cancel(listenCancel);
        if (action.flag) return true
        else {
            if (handle) {
                yield put(handle);
            }
            return false
        }
    }else {
        return true
    }
}

function* changeTab({currentTab}) {
    const taglist = yield select(state => state.get('typesystem').get('tagList').toJS());
    const tag = taglist[currentTab][0];
    if (tag) {
        const flag = yield call(handleEditTag, tag);
        if (flag) {
            yield put({type: 'typesystem/CHANGE_TAB', currentTab});
            yield put({type: 'typesystem/CLEAN_SEARCH_LIST'});
        }
    }else {
        yield call(cancelSelectedTag);
        yield put({type: 'typesystem/CHANGE_TAB', currentTab});
    }

}

function* handleEditTag(tag) {
    // const typesystem = yield select(state => state.get('typesystem').toJS());
    // const {activeTag, currentTab} = typesystem;
    const flag = yield call(canelCurrentEditHandle);
    if (flag) {
        yield put({type: 'typesystem/CHANGE_ACTIVE_TAG', tag: {value: tag.value, label: tag.label, index: 0}});
        // const params = {type: activeTag, value: currentTab};
        const params = {mongoId: tag.value};
        try {
            const data = yield call(typesystemApi.getTagDesc, params);
            yield put({type: 'typesystem/SET_EDIT_VALUE', payload: data});
        } catch(error){
            yield put({type: 'FETCH_FAILED', error});
        }
    }
    return flag
}

function* cancelSelectedTag(){
    yield put({type: 'typesystem/RESET_TAGLIST'});
    yield put({type: 'typesystem/RESET_FIELD_VALUES'});
    yield put({type: 'typesystem/CANCEL_SELECTED_TAG'});
}

function* editTag({tag, index}) {
    const typesystem = yield select(state => state.get('typesystem').toJS());
    const {activeTag, currentTab, currentFormIsUpdate} = typesystem;
    let flag = true;
    if (currentFormIsUpdate) {
        flag = yield call(canelCurrentEditHandle);
    }
    if (flag) {
        if (activeTag === tag.value) {
            yield call(cancelSelectedTag);
        }else {
            yield put({type: 'typesystem/CHANGE_ACTIVE_TAG', tag: {value: tag.value, label: tag.label, index}});
            const params = {mongoId: tag.value};
            try {
                const data = yield call(typesystemApi.getTagDesc, params);
                yield put({type: 'typesystem/SET_EDIT_VALUE', payload: data});
            } catch(error){
                yield put({type: 'FETCH_FAILED', error});
            }
        }
    }
}

function* deleteTag(action) {
    const flag = yield call(canelCurrentEditHandle);
    if (flag) {
        const typesystem = yield select(state => state.get('typesystem').toJS());
        const {activeTag, currentTab, currentTagIndex} = typesystem;
        const params = {mongoId: activeTag};
        try {
            yield call(typesystemApi.deleteTag, params);
            //删除成功
            action.CB();
            yield put({type: 'typesystem/UPADTE_TAGLIST', handle: 'delete', value: activeTag, tab: currentTab, index: currentTagIndex});
            yield call(cancelSelectedTag);
        } catch(error){
            yield put({type: 'FETCH_FAILED', error});
        }
    }
}

function* addTag(action){
    const currentTab = yield select(state => state.getIn(['typesystem', 'currentTab']));
    const params = {...action.fieldvalues, type: currentTab};
    try {
        const tagValue = yield call(typesystemApi.addTag, params);
        let typeName = action.fieldvalues.typeName;
        if (currentTab === 'relationType') {
            typeName = typeName + `（${action.fieldvalues.entityType_start.typeName} - ${action.fieldvalues.entityType_end.typeName}）`;
        }
        //添加成功
        action.CB();
        yield put({type: 'typesystem/UPADTE_TAGLIST', handle: 'add', value: tagValue, tab: currentTab, label: typeName});
        yield call(cancelSelectedTag);
    } catch(error){
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* updateTag(action){
    const currentTab = yield select(state => state.getIn(['typesystem', 'currentTab']));
    const activeTag = yield select(state => state.getIn(['typesystem', 'activeTag']));
    const currentTagIndex = yield select(state => state.getIn(['typesystem', 'currentTagIndex']));
    const params = {...action.fieldvalues, type: currentTab, mongoId:activeTag};
    try {
        const tagValue = yield call(typesystemApi.updateTag, params);
        let typeName = action.fieldvalues.typeName;
        if (currentTab === 'relationType') {
            typeName = typeName + `（${action.fieldvalues.entityType_start.typeName} - ${action.fieldvalues.entityType_end.typeName}）`;
        }
        //添加成功
        action.CB();
        yield put({type: 'typesystem/UPADTE_TAGLIST', handle: 'edit', index: currentTagIndex, tab: currentTab, label: typeName});
        yield call(cancelSelectedTag);
    } catch(error){
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* wantAddTag(){
    const needCheck = yield select(state => state.get('typesystem').get('currentFormIsUpdate'));
    let flag = true;
    if (needCheck) {
        flag = yield call(canelCurrentEditHandle);
    }
    if (flag) {
        yield call(cancelSelectedTag);
    }
}

function* watchCreateLesson() {
    yield[
        takeLatest('typesystem/saga/GET_TARGET_LIST', initTypesystem),
        takeLatest('typesystem/saga/SEARCH', search),
        takeLatest('typesystem/saga/CHANGE_TAB', changeTab),
        takeLatest('typesystem/saga/EDIT_TAG', editTag),
        takeLatest('typesystem/saga/DELETE_TAG', deleteTag),
        takeLatest('typesystem/saga/ADD_TAG', addTag),
        takeLatest('typesystem/saga/UPDATE_TAG', updateTag),
        takeLatest('typesystem/saga/WANT_ADD_TAG', wantAddTag)

    ];
}


export default function* typesystemSaga() {
    yield watchCreateLesson()
}
