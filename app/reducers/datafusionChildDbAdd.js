import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    currentStep: 2,
    modalVisible: false,
    modalConfirmLoading: false,
    mappingConfStep: 0,
    // selectTreeNode: [[],[[],[]],[[],[]],[[],[]]],                       //已经选择的数据，确认左面的数据
    mappingSelectData: [[],[],[],[]],                    //已经确认过的数据，在右面的数据
    step0TreeData: [],
    step1TreeData: [[],[]],
    MCTreeSelectValue: [[],[[],[]],[[],[]],[[],[]]],                    //已经选择数据的KEY，antd tree ues
    MCSelectValue: [{key: 'entity', lebel: '事件'},[],[],[]]                                         //mappinf conf 中每个select的值，返回时会用，右边的显示也需要这个值拼接
    // currentSelectTreeName: null
});

export default (state = initialState, action) => {
    const mappingConfStep = state.get('mappingConfStep');

    switch (action.type) {
        case 'datafusionChildDbAdd/TRIGGER_MODAL':
            return state.set('modalVisible', action.isShow);
        case 'datafusionChildDbAdd/HANDLE_MAPPING_STEP':
            if (action.status === 'next') return state.set('mappingConfStep', mappingConfStep+1);
            else if (action.status === 'prev') return state.set('mappingConfStep', mappingConfStep-1);
            else if (action.status === 'reset') {
                return state.set('mappingConfStep', 0)
                            .set('mappingSelectData', fromJS([[],[],[],[]]))
                            .set('MCTreeSelectValue', fromJS([[],[[],[]],[[],[]],[[],[]]]))
            }
        case 'datafusionChildDbAdd/ONLOAD_STEP0_TREE_DATA':
            return state.set('step0TreeData', fromJS(action.payload));
        case 'datafusionChildDbAdd/ONLOAD_STEP1_TREE_DATA':
            return state.setIn(['step1TreeData', 0], fromJS(action.payload))
                        .setIn(['step1TreeData', 1], fromJS(action.payload));
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
            return state.setIn(MCSelectValueIn, action.args.value);
        case 'datafusionChildDbAdd/CHANGE_SELECT_TREE_NODE':
            const mappingSelectValueIn = action.args.index!==null?['MCTreeSelectValue', action.args.step, action.args.index]:['MCTreeSelectValue', action.args.step];
            return state.setIn(mappingSelectValueIn, action.args.selectNodes);
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

        default:
            return state;
    }
};
