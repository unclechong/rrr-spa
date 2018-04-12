import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import datafusionApi from 'app_api/datafusionApi';

function* initDataFusion(){
    const treeData = yield call(getTreeData);
    if (treeData.databaseSource.length) {
        yield put({type: 'datafusion/CHANGE_TREE_SELECT', args: {index: [treeData.databaseSource[0].key], value: treeData.databaseSource[0].value}});
        const mongoId = treeData.databaseSource[0].value;
        const treeNodeDetail = yield call(datafusionApi.getTreeNodeDetail,{mongoId});
        yield put({type: 'datafusion/SET_TREENODE_DETAIL', payload: treeNodeDetail})
    }
}


function* getTreeData(){
    const treeData = yield call(datafusionApi.getTreeData);
    yield put({type: 'datafusion/GET_TREE_DATA_OK', payload: treeData});
    return treeData
}

function* changeTab({currentTab}){
    if (currentTab==='taskManage') {
        const activeTag = yield select(state => state.getIn(['datafusion', 'activeTag']));
        yield call(taskManagerOnChange, {args: {value: activeTag}})
    }
    yield put({type: 'datafusion/CHANGE_TAB', currentTab});
}

function* deleteTag({args: {type, value}}){
    const reult = yield call(datafusionApi.deleteOne, {mongoId: value});
    const treeData = yield select(state => state.getIn(['datafusion', 'treeData']));

    const typeName = type[0].split('-');
    typeName[0] = typeName[0] === '1'?'databaseSource':'documentSource';
    const newTreeData = treeData.deleteIn(typeName);

    yield put({type: 'datafusion/MERGE_TREE_DATA', payload: newTreeData.toJS()});
    yield put({type: 'datafusion/CHANGE_TREE_SELECT', args:{index: [], value: null}})

}







//db child saga
function* db_add_startMappingConf(){
    const {key:id} = yield select(state => state.getIn(['datafusionChildDbAdd', 'MCSelectValue', 0]).toJS());
    const treeData = yield call(datafusionApi.selectConceptByPid, {id});
    const formatTreeData = treeData.map((item,index)=>{
        return {
            title: item.name,
            key: index,
            value: item.id
        }
    })
    yield put({type: 'datafusionChildDbAdd/TRIGGER_MODAL', isShow: true});
    yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA', args: {treeData: formatTreeData}});
}

function* db_add_mappingConfNext(){
    const mappingSelectData = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingSelectData']).toJS());
    const mappingConfStep = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingConfStep']));
    const nextMappingConfStep = mappingConfStep + 1;
    if (nextMappingConfStep === 1) {
        const {value: selectValue, name: selectLabel} = mappingSelectData[mappingConfStep][0];
        const newTagData = yield select(state => state.getIn(['datafusionChildDbAdd', 'newTagData']).toJS());
        const [treeData, treeData2] = yield [
            call(datafusionApi.selectConceptById, {id: selectValue, type: 'attr'}),
            // call(datafusionApi.getOneFields, {mongoId: '5ab8929f1e36be17c06e4707'})
            call(datafusionApi.getOneFields, {mongoId: newTagData[0].id})
        ]
        // 上面步骤条+1
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ nextMappingConfStep + '_TREE_DATA', status: 'next', payload: {treeData:[{title: "名称", key: ""},...treeData],treeData2}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP', status: 'next'});
        // yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:[{key: selectValue, label: selectLabel},{key: '5ab8929f1e36be17c06e4707', label: '数据表11'}], index: null}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:[{key: selectValue, label: selectLabel},{key: newTagData[0].id, label: newTagData[0].sourceName}], index: null}});
    }else if (nextMappingConfStep === 2) {
        const {value: selectValue, name: selectLabel} = mappingSelectData[0][0];
        const treeData = yield call(datafusionApi.selectConceptById, {id: selectValue, type: 'relation'});
        const treeData2 = mappingSelectData[0].map(item=>({
            title: item.name,
            key: item.value
        }))
        // 上面步骤条+1
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ nextMappingConfStep + '_TREE_DATA', status: 'next', payload: {treeData,treeData2}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP', status: 'next'});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: selectValue, label: selectLabel}, index: null}});
    }else if (nextMappingConfStep === 3) {
        const {value: selectValue, name: selectLabel, treeData} = mappingSelectData[mappingConfStep][0];
        // const treeData = yield call(datafusionApi.getMappingDataInStep1);
        const _treeData = treeData.map((item,index)=>{
            return {
                title: item.name,
                key: index
            }
        })
        const newTagData = yield select(state => state.getIn(['datafusionChildDbAdd', 'newTagData']).toJS());

        // // 上面步骤条+1
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ nextMappingConfStep + '_TREE_DATA', status: 'next', payload: {treeData:_treeData,treeData2:[]}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MAPPING_STEP', status: 'next'});
        // yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:[{key: selectValue.split('|')[0], label: selectLabel},{key: '5ab8929f1e36be17c06e4707', label: '数据表11'}], index: null}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:[{key: selectValue.split('|')[0], label: selectLabel},{key: newTagData[0].id, label: newTagData[0].sourceName}], index: null}});
    }
}

function* changeTreeSelect({args}){
    const treeNodeDetail = yield call(datafusionApi.getTreeNodeDetail,{mongoId:args.value});
    yield put({type: 'datafusion/CHANGE_TREE_SELECT', args})
    yield put({type: 'datafusion/SET_TREENODE_DETAIL', payload: treeNodeDetail})
}

function* handleTagEdit({args}){
    // console.log(args.id);
    // const selectTreeNodeValue = yield select(state => state.getIn(['datafusion', 'selectTreeNodeValue']));
    const data = yield call(datafusionApi.getDbItemEditInfo, {mongoId: args.id});
    if (args.type === 'db') {
        yield put({type: 'datafusionChildDbEdit/GET_CURRENT_TAG_DATA_OK', payload: data})
    }else {
        yield put({type: 'datafusionChildDmlEdit/GET_CURRENT_TAG_DATA_OK', payload: data})
    }
}
//
// function* addNewTag(){
//     yield put({type: 'datafusion/CHANGE_TREE_SELECT', args:{index: [], value: null}})
// }

function* hanleNewTagSave({args}){
    const {step, data} = args;
    if (step === 1 || step === '1') {
        const result = yield call(datafusionApi.handleAddNewTagSave, {...args.data});
        const treeData = yield select(state => state.getIn(['datafusion', 'treeData']).toJS());
        const _index = treeData.databaseSource.length?_.last(_.last(treeData.databaseSource).key.split('-')):-1
        const _key =`1-${Number(_index)+1}`;
        treeData.databaseSource.push({
            title: data.sourceName,
            key: _key,
            value: result
        })
        yield put({type: 'datafusion/MERGE_TREE_DATA', payload: treeData});
        yield put({type: 'datafusionChildDbAdd/ADD_NEW_DB_NEXT_STEP', args: {data: {id: result, ...args.data}, index: '0'}});
    }else if(step === 2 || step === '2'){
        const result = yield call(datafusionApi.handleAddNewTagSave2, args.data);
        yield put({type: 'datafusionChildDbAdd/ADD_NEW_DB_NEXT_STEP', args: {data: args.data, index: '1'}});
    }else if(step === 3 || step === '3') {
        const result = yield call(datafusionApi.handleAddNewTagSave2, args.data);
        const treeData = yield select(state => state.getIn(['datafusion', 'treeData']).toJS());
        const lastItem = _.last(treeData.databaseSource);
        yield put({type: 'datafusion/CHANGE_TREE_SELECT', args: {index: [lastItem.key], value: lastItem.value}});
        args.CB()
        const treeNodeDetail = yield call(datafusionApi.getTreeNodeDetail,{mongoId:lastItem.value});
        yield put({type: 'datafusion/SET_TREENODE_DETAIL', payload: treeNodeDetail})
    }
}

function* showExample({args}){
    const result = yield call(datafusionApi.getOneSamples, args.data);
    if (Object.keys(result).length) {
        yield put({type:'datafusionChildDbAdd/GET_EXAMPLE_DATA_OK', payload: result})
    }else {
        args.CB();
    }
}

function* onLoadStep1TreeData({args:{treeNode,newTreeData}}){
    const treeData = yield call(datafusionApi.selectConceptByPid, {id:treeNode.props.nodeValue});
    treeNode.props.dataRef.children = treeData.map((item,index)=>{
        return {
            title: item.name,
            key: `${treeNode.props.eventKey}-${index}`,
            value: item.id
        }
    })
    yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA', args: {treeData: newTreeData}});
}

function* handleMCSelectChange({args:{value,index}}){
    const mappingConfStep = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingConfStep']));
    if (mappingConfStep === 1) {
        const treeData = yield call(datafusionApi.selectConceptById, {id: value.key, type: 'attr'});
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ mappingConfStep + '_TREE_DATA', status: 'next', payload: {treeData:[{title: "名称", key: ""}, ...treeData]}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: value.key, label: value.label}, index}});
    }else if(mappingConfStep === 2){
        const treeData = yield call(datafusionApi.selectConceptById, {id: value.key, type: 'relation'});
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ mappingConfStep + '_TREE_DATA', status: 'next', payload: {treeData}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: value.key, label: value.label}, index:null}});
    }else if (mappingConfStep === 3) {
        const mappingSelectData = yield select(state => state.getIn(['datafusionChildDbAdd', 'mappingSelectData']).toJS());
        const data = mappingSelectData[mappingConfStep-1];
        let treeData = [];
        data.map(item=>{
            if (value.key === item.value.split('|')[0]) {
                treeData = item.treeData
            }
        })
        yield put({type: 'datafusionChildDbAdd/ONLOAD_STEP'+ mappingConfStep + '_TREE_DATA', status: 'next', payload: {treeData:treeData.map((item,index)=>({title: item.name,key: index}))}});
        yield put({type: 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE', args: {value:{key: value.key, label: value.label}, index:0}});
    }
}

function* taskManagerOnChange({args:{value}}){
    const result = yield call(datafusionApi.getTaskList, {jobGroup: value});
    yield put({type:'datafusionChildTaskManager/GET_TASK_MANAGE_LIST_OK', payload: {data: result, value}});
}

function* hanleNewDmlTagSave({args}){
    const {step, data} = args;
    if (step === 1 || step === '1') {
        const result = yield call(datafusionApi.handleAddNewTagSave, {...args.data});
        const treeData = yield select(state => state.getIn(['datafusion', 'treeData']).toJS());
        const _index = treeData.documentSource.length?_.last(_.last(treeData.documentSource).key.split('-')):-1
        const _key =`0-${Number(_index)+1}`;
        treeData.documentSource.push({
            title: data.sourceName,
            key: _key,
            value: result
        })
        yield put({type: 'datafusion/MERGE_TREE_DATA', payload: treeData});
        yield put({type: 'datafusionChildDmlAdd/ADD_NEW_DML_NEXT_STEP', args: {data: {id: result, ...args.data}, index: '0'}});
    }else if(step === 2 || step === '2'){
        const [result, data] = yield [
            call(datafusionApi.handleAddNewTagSave2, args.data),
            call(datafusionApi.getPipelineList)
        ]
        args.CB(data)
        yield put({type: 'datafusionChildDmlAdd/ADD_NEW_DML_NEXT_STEP', args: {data: args.data, index: '1'}});
    }else if(step === 3 || step === '3') {
        const result = yield call(datafusionApi.handleAddNewTagSave2, args.data);
        const treeData = yield select(state => state.getIn(['datafusion', 'treeData']).toJS());
        const lastItem = _.last(treeData.documentSource);
        yield put({type: 'datafusion/CHANGE_TREE_SELECT', args: {index: [lastItem.key], value: lastItem.value}});
        args.CB()
        const treeNodeDetail = yield call(datafusionApi.getTreeNodeDetail,{mongoId:lastItem.value});
        yield put({type: 'datafusion/SET_TREENODE_DETAIL', payload: treeNodeDetail})
    }
}

function* dmlAddshowExample({args}){
    const result = yield call(datafusionApi.getOneSamples, args.data);
    if (Object.keys(result).length) {
        yield put({type:'datafusionChildDmlAdd/GET_EXAMPLE_DATA_OK', payload: result})
    }else {
        args.CB();
    }
}

function* watchCreateLesson() {
    yield[
        takeLatest('datafusion/saga/CHANGE_TAB', changeTab),
        takeLatest('datafusion/saga/GET_TREE_DATA', getTreeData),
        takeLatest('datafusion/saga/INIT_DATA_FUSION', initDataFusion),
        takeLatest('datafusion/saga/CHANGE_TREE_SELECT', changeTreeSelect),
        takeLatest('datafusion/saga/DELETE_TAG', deleteTag),

        takeLatest('datafusionChildDbAdd/saga/ADD_NEW_DB_NEXT_STEP', hanleNewTagSave),
        takeLatest('datafusionChildDbAdd/saga/SHOW_EXAMPLE_DATA', showExample),
        takeLatest('datafusionChildDbAdd/saga/ONLOAD_STEP0_TREE_DATA', onLoadStep1TreeData),
        takeLatest('datafusionChildDbAdd/saga/START_MAPPING_CONF', db_add_startMappingConf),
        takeLatest('datafusionChildDbAdd/saga/MAPPING_CONG_NEXT', db_add_mappingConfNext),
        takeLatest('datafusionChildDbAdd/saga/HANDLE_MC_SLEECT_CHANGE', handleMCSelectChange),

        takeLatest('datafusionChildDmlAdd/saga/ADD_NEW_DML_NEXT_STEP', hanleNewDmlTagSave),
        takeLatest('datafusionChildDmlAdd/saga/SHOW_EXAMPLE_DATA', dmlAddshowExample),

        takeLatest('datafusionChildEdit/saga/GET_CURRENT_TAG_DATA', handleTagEdit),

        takeLatest('datafusionChildTaskManager/saga/TASK_MANAGER_ONCHANGE', taskManagerOnChange),
    ];
}

export default function* datafusionSaga() {
    yield watchCreateLesson()
}
