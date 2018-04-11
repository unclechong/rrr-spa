import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import knowledgegraphApi from 'app_api/knowledgegraphApi';
import typesystemApi from 'app_api/typesystemApi';
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
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload});
    const defaultItem = result[0];
    yield call(setFieldsValues, {values: defaultItem});
    yield call(setTreeSelect, {selectKey:['0'], selectInfo: {...defaultItem, idPath: `0/${defaultItem.id}`}});
}

function* changeTab({args}) {
    yield put({type: 'knowledgegraph/CHANGE_TAB', args});
    yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: args.currentTab});
    if (args.currentTab === 'event') {
        const eventTagList = yield select(state => state.getIn(['knowledgegraph', 'eventTagList']).toJS());
        if (!eventTagList.length) {
            const {eventType} = yield call(typesystemApi.getTagList);
            yield put({type: 'knowledgegraph/GET_TAGLIST_OK', payload: eventType});
            if (eventType.length) {
                yield call(getEventTagDetail, {args: {type: eventType[0].label, value: eventType[0].value}});
            }
        }
    }
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
    yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: 'entity'});
    yield call(setTreeSelect, {selectKey, selectInfo: {...result, idPath: selectIdPath}})
    yield call(setFieldsValues, {values: result})
}

function* updateEntityBaseInfo({args: {values, CB}}){
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']).toJS());
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));

    yield call(knowledgegraphApi.updateConceptBaseInfoById, {...values, id: entityTreeSelectInfo.entityTreeSlecetValue});

    let keyStr = entityTreeSelectInfo.entityTreeSlecetKey[0].replace(/-/g, ',children,');
    const keyArr = keyStr.split(',');
    const newEntityTreeData = entityTreeData.setIn([...keyArr, 'title'], values.name);
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newEntityTreeData.toJS()});
    yield put({type: 'knowledgegraph/UPDATE_ENTITY_SUCCESS', payload: values.name});
    CB();
}

function* addEntityBaseInfo({args: {values, CB}}) {
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']).toJS());
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));
    yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: 'entity'});
    const {entityTreeSlecetKey, entityTreeSlecetPValue, entityTreeSlecetLabel, entityTreeSlecetIdPath} = entityTreeSelectInfo;
    const params = {
        ...values,
        parentName: entityTreeSlecetLabel,
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
            idPath: `${entityTreeSlecetIdPath}/${newId}`,
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
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));

    let keyStr = entityTreeSelectInfo.entityTreeSlecetKey[0].replace(/-/g, ',children,');
    const keyArr = keyStr.split(',');
    const newKeyArr = _.dropRight(keyArr);
    const hasChildren = entityTreeData.getIn(newKeyArr);
    let newEntityTreeData = null;
    //进行删除时，如果该节点下面只有一个子节点，那么就把children字段删除
    if (!!hasChildren && hasChildren.size === 1) {
        newEntityTreeData = entityTreeData.deleteIn([...newKeyArr]);
    }else {
        // 删除之后导致key混乱，由于树key的规则是按下标来排序，所以删除的时候也要同时将当前节点下所有子节点的下标重置
        const newChild = hasChildren.delete(_.last(keyArr)).map((item,index)=>{
            let _key = item.get('key');
            return item.set('key', _key.substring(0, _key.lastIndexOf('-') + 1) + index)
        })
        newEntityTreeData = entityTreeData.setIn(newKeyArr, newChild)
    }
    yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: null});
    yield put({type: 'knowledgegraph/DELETE_ENTITY_SUCCESS'});
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newEntityTreeData.toJS()});
    args.CB()
}

function* getEventTagDetail({args: {type, value}}){
    const eventDetail = yield call(knowledgegraphApi.listEventByType, {type});
    yield put({type: 'knowledgegraph/GET_EVENT_TAG_DETAIL_OK', payload: eventDetail});
    yield put({type: 'knowledgegraph/CHANGE_TAGLIST_ACTIVETAG', args: {activeTag: value}});

}

function* entryShowInstance(){
    const entityTreeSlecetValue = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo', 'entityTreeSlecetValue']));
    const result = yield call(knowledgegraphApi.selectEntityByPid, {pid: entityTreeSlecetValue});
    yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: 'instance'});
    yield put({type: 'knowledgegraph/ENTRY_SHOW_INSTANCE', args:{data: result, key: entityTreeSlecetValue}})
}

function* showEntityPropConf(){
    yield put({type: 'knowledgegraph/SHOW_ENTITY_PROP_CONF'})
}

function* entityPropEdit({args}){
    if (args.item) {
        const [treeData, treeData2] = yield [
            call(knowledgegraphApi.updateRelationOrAttribute, args.item),
            call(knowledgegraphApi.updateConceptAttribute, args.data)
        ]
    }else {
        //删除操作
        yield call(knowledgegraphApi.updateConceptAttribute, args.data)
    }

}

function* entityPropAdd({args}){
    const id = yield call(knowledgegraphApi.insertRelationOrAttribute, args.item);
    const addItem = args.data[args.item.propType==='数值'?'attrList':'relationList'];
    addItem[addItem.length-1].id = id;
    yield call(knowledgegraphApi.updateConceptAttribute, args.data);
    args.CB(id);
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

function* setTreeSelect({selectKey, selectInfo}){
    const entityTreeSelectInfo = {
        entityTreeSlecetKey: selectKey,
        entityTreeSlecetValue: selectInfo.id,
        entityTreeSlecetLabel: selectInfo.name,
        entityTreeSlecetPValue: selectInfo.pid,
        entityTreeSlecetPLabel: selectInfo.parentName || '暂无',
        entityTreeSlecetIdPath: selectInfo.idPath,
        entityTreeSlecetItem: selectInfo,

    }
    yield put({type: 'knowledgegraph/CHANGE_ENTITY_TREE_SELECT', args: {entityTreeSelectInfo}})
}
//

function* watchCreateLesson() {
    yield[
        takeLatest('knowledgegraph/saga/INIT_PAGE', initKnowledgegraph),
        takeLatest('knowledgegraph/saga/CHANGE_TAB', changeTab),
        takeLatest('knowledgegraph/saga/ONLOAD_ENTITY_TREEDATA', onLoadEntityTreeData),
        takeLatest('knowledgegraph/saga/CHANGE_ENTITY_TREE_SELECT', changeEntityTreeSelect),
        takeLatest('knowledgegraph/saga/UPDATE_ENTITY_BSAE_INFO', updateEntityBaseInfo),
        takeLatest('knowledgegraph/saga/ADD_ENTITY_BSAE_INFO',addEntityBaseInfo),
        takeLatest('knowledgegraph/saga/DELETE_ENTITY', deleteEntity),
        takeLatest('knowledgegraph/saga/GET_EVENT_TAG_DETAIL', getEventTagDetail),
        takeLatest('knowledgegraph/saga/ENTRY_SHOW_INSTANCE', entryShowInstance),
        takeLatest('knowledgegraph/saga/SHOW_ENTITY_PROP_CONF', showEntityPropConf),
        takeLatest('knowledgegraph/saga/ENTITY_PROP_EDIT', entityPropEdit),
        takeLatest('knowledgegraph/saga/ENTITY_PROP_ADD', entityPropAdd),


    ];
}

export default function* knowledgegraphSaga() {
    yield watchCreateLesson()
}
