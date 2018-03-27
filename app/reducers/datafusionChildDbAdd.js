import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    currentStep: 0,
    modalVisible: false,
    modalConfirmLoading: false,
    mappingConfStep: 0,
    mappingSelectData: [[],[],[],[]],                    //已经确认过的数据，在右面的数据
    step0TreeData: [],
    step1TreeData: [[],[]],
    step2TreeData: [[],[]],
    step3TreeData: [[],[]],
    // step2SelectOptionsData: [],                                         //第三步中，关系下拉框中的数据
    MCTreeSelectValue: [[],[[],[]],[[],[]],[[],[]]],                    //已经选择数据的KEY，antd tree ues
    MCSelectValue: [{key: '0', lebel: '实体'},[],[],[]],                                         //mappinf conf 中每个select的值，返回时会用，右边的显示也需要这个值拼接
    newTagData: [],


    modalVisible2: false,
    modal2Data: {},
    modalCurrentConent:0
});


//备忘三个事情。
// index.js中的 如果是在添加页面则重定向到list
// currentStep 重置为0
// mapping中第二步的select option 注释放开
// saga  db_add_mappingConfNext第一个判断中的默认值注释放开

export default (state = initialState, action) => {
    const mappingConfStep = state.get('mappingConfStep');

    switch (action.type) {
        case 'datafusionChildDbAdd/TRIGGER_MODAL':
            return state.set('modalVisible', action.isShow);
        case 'datafusionChildDbAdd/ADD_NEW_DB_NEXT_STEP':
            return state.set('currentStep', state.get('currentStep')+1)
                        .setIn(['newTagData', action.args.index], fromJS(action.args.data))
        case 'datafusionChildDbAdd/HANDLE_MAPPING_STEP':
            if (action.status === 'next') return state.set('mappingConfStep', mappingConfStep+1);
            else if (action.status === 'prev') return state.set('mappingConfStep', mappingConfStep-1);
            else if (action.status === 'reset') {
                return state.set('mappingConfStep', 0)
                            .set('mappingSelectData', fromJS([[],[],[],[]]))
                            .set('MCTreeSelectValue', fromJS([[],[[],[]],[[],[]],[[],[]]]))
            }
        case 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA':
            return state.set('step0TreeData', fromJS(action.args.treeData));
        case 'datafusionChildDbAdd/ONLOAD_STEP1_TREE_DATA':
            if (!!action.payload.treeData2) {
                return state.setIn(['step1TreeData', 0], fromJS(action.payload.treeData))
                            .setIn(['step1TreeData', 1], fromJS(action.payload.treeData2));
            }else {
                return state.setIn(['step1TreeData', 0], fromJS(action.payload.treeData))
                            .setIn(['MCTreeSelectValue', mappingConfStep], fromJS([[],[]]));
            }
        case 'datafusionChildDbAdd/ONLOAD_STEP2_TREE_DATA':
            if (action.payload.treeData2) {
                return state.setIn(['step2TreeData', 0], fromJS(action.payload.treeData))
                            .setIn(['step2TreeData', 1], fromJS(action.payload.treeData2));
            }
            return state.setIn(['step2TreeData', 0], fromJS(action.payload.treeData))
                        .setIn(['MCTreeSelectValue', mappingConfStep], fromJS([[],[]]));
        case 'datafusionChildDbAdd/ONLOAD_STEP3_TREE_DATA':
            if (action.payload.treeData2) {
                return state.setIn(['step3TreeData', 0], fromJS(action.payload.treeData))
                            .setIn(['step3TreeData', 1], state.getIn(['step1TreeData', 1]));
            }
            return state.setIn(['step3TreeData', 0], fromJS(action.payload.treeData))

        case 'datafusionChildDbAdd/CLEAN_MAPPING_SELECT_DATA':
            // mapping配置step1时，清空操作
            // 清空右边已确认的值
            // 清空左边已选择的值
            // 清空左边已选择的KEY
            return state.setIn(['mappingSelectData', mappingConfStep], List())
                        .setIn(['MCTreeSelectValue', mappingConfStep], List())
                        .set('step0TreeData', action.args.treeData);
        case 'datafusionChildDbAdd/CLEAN_MAPPING_SELECT_DATA_OTHER':
            return state.setIn(['mappingSelectData', mappingConfStep], List())
                        .setIn(['MCTreeSelectValue', mappingConfStep], fromJS([[],[]]));
        case 'datafusionChildDbAdd/HANDLE_MC_SLEECT_CHANGE':
            const MCSelectValueIn = action.args.index!==null?['MCSelectValue', mappingConfStep, action.args.index]:['MCSelectValue', mappingConfStep];
            return state.setIn(MCSelectValueIn, fromJS(action.args.value));
        case 'datafusionChildDbAdd/CHANGE_SELECT_TREE_NODE':
            const mappingSelectValueIn = action.args.index!==null?['MCTreeSelectValue', action.args.step, action.args.index]:['MCTreeSelectValue', action.args.step];
            return state.setIn(mappingSelectValueIn, action.args.selectNodes);
        // case 'datafusionChildDbAdd/INIT_STEP2_SELECT_OPTION':
        //     return state.set('step2SelectOptionsData', action.args.selectOptionsData);
        case 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA':
            return state.updateIn(['mappingSelectData', mappingConfStep], arr=>{
                            return arr.concat(List(action.args.listArr))
                        })
                        .setIn(['MCTreeSelectValue', mappingConfStep], List())
                        .set('step0TreeData', action.args.treeData);
        case 'datafusionChildDbAdd/MERGE_MAPPING_SELECT_DATA_OTHER':
            return state.updateIn(['mappingSelectData', mappingConfStep], arr=>{
                            return arr.concat(List(action.args.listArr))
                        })
                        .setIn(['MCTreeSelectValue', mappingConfStep], List([[],[]]));

        case 'datafusionChildDbAdd/GET_EXAMPLE_DATA_OK':
            return state.set('modalVisible2', true)
                        .set('modal2Data', action.payload)
        case 'datafusionChildDbAdd/HIDE_MODAL2':
            return state.set('modalVisible2', false)
                        .set('modalCurrentConent', 0)
                        .set('modal2Data', {})
        case 'datafusionChildDbAdd/MODAL2_HANDLE_CONTENT':
            let currentIndex = state.get('modalCurrentConent');
            if (action.args.status === 'next') {
                currentIndex === state.get('modal2Data').length-1?currentIndex:++currentIndex
            }else if(action.args.status === 'prev'){
                currentIndex === 0?0:--currentIndex
            }
            return state.set('modalCurrentConent', currentIndex)
        case 'datafusionChildDbAdd/CURRENT_COMPONENT_LEAVE' :
            return initialState

        default:
            return state;
    }
};
