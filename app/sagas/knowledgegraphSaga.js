import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import knowledgegraphApi from 'app_api/knowledgegraphApi';
import { List, Map } from 'immutable';

function* initKnowledgegraph() {
    const result = yield call(knowledgegraphApi.selectConceptByPid, {id: '0'})
    const payload = result.map((item,index)=>({
        title: item.name,
        key: index.toString(),
        value: item.id,
        hasTitleBtn: true,
        idPath: `0/${item.id}`
    }))
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload})
    const defaultItem = result[0];
    yield call(setFieldsValues, {values: defaultItem})
    yield call(setTreeSelect, {selectKey:['0'], selectInfo: {...defaultItem, idPath: `0/${defaultItem.id}`}})
}

function* onLoadEntityTreeData({args:{treeNode,newTreeData}}){
    const loadData = yield call(knowledgegraphApi.selectConceptByPid, {id: treeNode.props.nodeValue});
    if (loadData.length) {
        treeNode.props.dataRef.children = loadData.map((item,index)=>{
            return {
                title: item.name,
                key: `${treeNode.props.eventKey}-${index}`,
                value: item.id,
                hasTitleBtn: true,
                idPath: `${treeNode.props.idPath}/${item.id}`
            }
        })
    }
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newTreeData})
}

function* changeEntityTreeSelect({args: {selectKey, selectValue, selectIdPath}}){
    const result = yield call(knowledgegraphApi.selectConceptById, {id: selectValue})
    yield call(setTreeSelect, {selectKey, selectInfo: {...result, idPath: selectIdPath}})
    yield call(setFieldsValues, {values: result})
}

function* updateEntityBaseInfo({args: {values, CB}}){
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']).toJS());
    //  遗留问题，现在概念的名称不能修改， 如果需要修改则要动态将左面书中的名字实时更新，需要用immutable
    yield call(knowledgegraphApi.updateConceptBaseInfoById, {...values, id: entityTreeSelectInfo.entityTreeSlecetValue});
    yield put({type: 'knowledgegraph/UPDATE_ENTITY_SUCCESS'});
    CB();
}

function* addEntityBaseInfo({args: {values, CB}}) {
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']).toJS());
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));

    const {entityTreeSlecetKey, entityTreeSlecetPValue, entityTreeSlecetPLabel, entityTreeSlecetIdPath} = entityTreeSelectInfo;
    const params = {
        ...values,
        parentName: entityTreeSlecetPLabel,
        idPath: entityTreeSlecetIdPath
    }
    const newId = yield call(knowledgegraphApi.insertConceptReturnId, params);

    let keyStr = entityTreeSelectInfo.entityTreeSlecetKey[0].replace(/-/g, ',children,');
    const keyArr = keyStr.split(',');
    const hasChildren = entityTreeData.getIn([...keyArr, 'children']);
    if (!!hasChildren) {
        const newEntityTreeData = entityTreeData.setIn([...keyArr, 'children'], hasChildren.push(Map({
            title: values.name,
            key: `${entityTreeSlecetKey[0]}-${hasChildren.size}`,
            value: newId,
            hasTitleBtn: true
        })));
        yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newEntityTreeData.toJS()});
    }
    yield put({type: 'knowledgegraph/ADD_ENTITY_SUCCESS'});
    CB();
}

function* deleteEntity({args}){
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']).toJS());
    yield call(knowledgegraphApi.deleteConceptById, {id: entityTreeSelectInfo.entityTreeSlecetValue});
    //删除逻辑还没有写
    args.CB()
}




// factory FN
function* setFieldsValues({values: {pid, name, photoBase64, description}}){
    const fieldsValue = {
        name: {value: name},
        pid: {value: pid},
        description: {value: description},
        photoBase64: {value: photoBase64}
    }
    yield put({type: 'knowledgegraph/SET_FIELDS_VALUES', payload: fieldsValue})
}

function* setTreeSelect({selectKey, selectInfo: {id, pid, parentName, name, idPath}}){
    const entityTreeSelectInfo = {
        entityTreeSlecetKey: selectKey,
        entityTreeSlecetValue: id,
        entityTreeSlecetLabel: name,
        entityTreeSlecetPValue: pid,
        entityTreeSlecetPLabel: parentName || '暂无',
        entityTreeSlecetIdPath: idPath
    }
    yield put({type: 'knowledgegraph/CHANGE_ENTITY_TREE_SELECT', args: {entityTreeSelectInfo}})
}

function* watchCreateLesson() {
    yield[
        takeLatest('knowledgegraph/saga/INIT_PAGE', initKnowledgegraph),
        takeLatest('knowledgegraph/saga/ONLOAD_ENTITY_TREEDATA', onLoadEntityTreeData),
        takeLatest('knowledgegraph/saga/CHANGE_ENTITY_TREE_SELECT', changeEntityTreeSelect),
        takeLatest('knowledgegraph/saga/UPDATE_ENTITY_BSAE_INFO', updateEntityBaseInfo),
        takeLatest('knowledgegraph/saga/ADD_ENTITY_BSAE_INFO',addEntityBaseInfo),
        takeLatest('knowledgegraph/saga/DELETE_ENTITY', deleteEntity),
    ];
}

export default function* knowledgegraphSaga() {
    yield watchCreateLesson()
}
