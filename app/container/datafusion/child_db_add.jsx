import { Steps, Form, Row, Col, Button, Alert, Modal, Divider, Select, Tag, Tree, message } from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';
import QueueAnim from 'rc-queue-anim';
import { fromJS } from 'immutable';

import Card from 'app_component/card';
import List from 'app_component/list';
import Label from 'app_component/label';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
    [
        {
            label:'名称',
            id:'name_1',
            key:'name_1',
            type:'input'
        }, {
            label:'描述',
            key:'desc_1',
            id:'desc_1',
            type:'inputArea',
            required:false,
        }
    ], [
        {
            label:'任务名称',
            id:'task_name_2',
            key:'task_name_2',
            type:'input'
        }, {
            label:'任务类型',
            key:'task_type_2',
            id:'task_type_2',
            type:'select',
            options:[
                {
                    label:'总量任务',
                    value:'all'
                }, {
                    label:'增量任务',
                    value:'else'
                }
            ]
        }, {
            label:'文档类型',
            key:'dml_type_2',
            id:'dml_type_2',
            type:'select',
            options:[
                {
                    label:'TBT通报',
                    value:'TBT'
                }
            ]
        }, {
            label:'API地址',
            key:'API_2',
            id:'API_2',
            type:'inputArea',
            required:true,
            hasBtn:<Button style={{float: 'right'}} type="dashed">样例数据</Button>
        }
    ], [
        {
            label:'任务名称',
            id:'task_name_3',
            key:'task_name_3',
            type:'input'
        }, {
            label:'模型',
            key:'module_3',
            id:'module_3',
            type:'hasBtnSelect',
            options:[
                {
                    label:'D2R',
                    value:'D2R'
                }
            ],
            hasBtn:<Button style={{float: 'right', marginTop: 4}} type="dashed">样例数据</Button>
        }, {
            label:'映射关系',
            key:'mapping_3',
            id:'mapping_3',
            type:'button',
            buttonName:'Mapping管理'
        }
    ]
]

const mapStateToProps = state => {
    return {dbAdd: state.get('datafusionChildDbAdd').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
export default class Child03 extends React.Component{

    constructor(props){
        super(props)

        //bind mapping conf btn callback
        FORM_ITEM_LIST[2][2].onClick = this.handleMappingConf;

        //左侧选择列表选中的的标签的信息{name:..., key:..., value:...}, 右侧选中的树需要将此列表拼接成需要的数据，上一步下一步将会被清空
        this.mappingConfTreeSplitArr = [];
        // 步骤一中，左侧树选中的节点的KEY，由于是多选，并且可以多次添加，由这个变量去校验左侧树的disable，在点击右侧清空按钮时一并清空
        this.selectableArr = [];
    }

    componentDidMount(){
        this.props.actions.startMappingConf();
    }

    onSubmit = () => {
        this.props.form.validateFields(
            (err,values) => {
                console.log(values);
                if (!err) {
                    if (this.state.currentStep !== 2) {
                        this.setState({
                            currentStep:++this.state.currentStep
                        })
                    }
                }
            }
        );
    }

    //进入 mapping 配置
    handleMappingConf = () => {
        this.props.actions.startMappingConf();
    }

    mappingConfNext = step => {
        const {mappingSelectData} = this.props.dbAdd;
        if (!mappingSelectData[step].length && (step === 0 || step === 1)) {
            message.info('请先选择');
            return
        }
        this.mappingConfTreeSplitArr = [];
        this.props.actions.mappingConfNext('next');
    }

    mappingConfPrev = () => {
        this.mappingConfTreeSplitArr = [];
        this.props.actions.handleMappingStep('prev');
    }

    handleModalCancel = () => {
        this.mappingConfTreeSplitArr = [];
        this.props.actions.cancelMappingConf();
    }

    MCSelectChange = (e,index=null) => {
        this.props.actions.handleMCSelectChange({value:e,index});
    }

    onLoadData = (treeNode) => {

        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }

             treeNode.props.dataRef.children = [
                 { title: `${treeNode.props.eventKey}-0`, key: `${treeNode.props.eventKey}-0` },
                 { title: `${treeNode.props.eventKey}-1`, key: `${treeNode.props.eventKey}-1` },
             ];
             this.props.actions.onLoadStep1TreeData(this.props.dbAdd.step0TreeData);
             resolve();
        })
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode {...item} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            // selectable={false}
            return <TreeNode {...item} dataRef={item} />;
        });
    }

    handelMCTreeSelect = (step, selectNodes, e, index=null) => {
        if (step === 0) {
            this.mappingConfTreeSplitArr = e.selectedNodes;
        }else {
            this.mappingConfTreeSplitArr[index] = e.selectedNodes;
        }
        this.props.actions.changeSelectTreeNode({step, selectNodes, index})
    }

    addMCTreeSelect = (step) => {
        if (step === 0) {
            const listArr = this.mappingConfTreeSplitArr.map(_node=>({
                name: _node.props.title,
                value: _node.key,
                key: _node.key
            }))
            this.props.actions.addMappingSelect({listArr, treeData: this.formatTreeData(false)});
        }else {
            const {MCSelectValue, mappingSelectData} = this.props.dbAdd;
            const addName = MCSelectValue[step][0].label;
            const [[firArr], [secArr]] = this.mappingConfTreeSplitArr;
            const listArr = [{
                name: <span>{`${addName}/${firArr.props.title}`}<span style={{marginLeft: 20}}>{secArr.props.title}</span></span>,
                value: `${firArr.key}|${secArr.key}`,
                key: `${firArr.key}|${secArr.key}`
            }]
            const currentValue = listArr[0].value;
            const loopData = mappingSelectData[step];
            for (let i = 0; i < loopData.length; i++) {
                const hasValue = loopData[i].value;
                if (currentValue === hasValue) {
                    message.info('请勿重复添加！');
                    return
                }
            }
            this.props.actions.addMappingSelectOther({listArr});
        }

    }

    formatTreeData = (selectable) => {
        const selectValueArr = this.props.dbAdd.MCTreeSelectValue[0];
        if(!selectable){
            this.selectableArr = this.selectableArr.concat(selectValueArr);
        }
        const treeData = this.props.dbAdd.step0TreeData;
        let newTreeData = fromJS(treeData);
        this.selectableArr.map(nodeKey => {
            const setInStr = nodeKey.replace(/-/g, ',children,');
            const setInArr = setInStr.split(',');
            newTreeData = newTreeData.updateIn(setInArr, val=>{
                return val.set('selectable', selectable)
            })
        })

        return newTreeData.toJS()
    }

    handleCleanMappingSelectData = () => {

        this.props.actions.cleanMappingSelectData({treeData: this.formatTreeData(true)});
        this.selectableArr = [];
    }

    cleanMCSelectDataStepOther = () =>{
        this.props.actions.cleanMCSelectDataStepOther();
    }

    renderMappingConfChild = (step, mappingSelectData) => {
        const {selectTreeNode, step0TreeData, MCTreeSelectValue, step1TreeData, MCSelectValue} = this.props.dbAdd;
        if (step === 0) {
            return (
                <Row gutter={16}>
                    <Col xl={7} offset={7}>
                        <Label label='概念类型' />
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            key='step_0_select'
                            labelInValue
                            value={MCSelectValue[0]}
                            onChange={e=>{this.MCSelectChange(e,null)}}>
                            <Option value="entity">实体</Option>
                            <Option value="event">事件</Option>
                        </Select>
                        <Label label='概念' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <Tree
                                loadData={this.onLoadData}
                                selectedKeys={MCTreeSelectValue[0]}
                                multiple
                                onSelect={(index, e)=>{this.handelMCTreeSelect(0, index, e)}}
                            >
                                {this.renderTreeNodes(step0TreeData || [])}
                            </Tree>
                        </div>
                    </Col>
                    <Col xl={3} style={{paddingTop: 94}}>
                        <Button type='primary' disabled={!MCTreeSelectValue[0].length} onClick={()=>{this.addMCTreeSelect(0)}}>确定</Button>
                    </Col>
                    <Col xl={7}>
                        <Label label='已选概念' hasBtn={<Tag color="red" onClick={this.handleCleanMappingSelectData}>清空</Tag>} />
                        <List
                            style={{width: '90%'}}
                            list={mappingSelectData[step]}
                        />
                    </Col>
                </Row>
            )
        }else if (step === 1) {
            return (
                <Row gutter={16}>
                    <Col xl={7} >
                        <Label label='概念列表' />
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            value={MCSelectValue[1][0]}
                            labelInValue
                            key='step_1_select'
                            onChange={e=>{this.MCSelectChange(e,'0')}}
                        >
                            {
                                mappingSelectData[0].map(opt=><Option value={opt.value} key={opt.key}>{opt.name}</Option>)
                            }
                        </Select>
                        <Label label='属性' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8'}}>
                            <Tree
                                key='step_1_tree'
                                selectedKeys={MCTreeSelectValue[1][0]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(1, index, e, 0)}}
                            >
                                {this.renderTreeNodes(step1TreeData[0] || [])}
                            </Tree>
                        </div>
                    </Col>
                    <Col xl={7}>
                        <Label label='数据表' />
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            key='step_1_select_2'
                            onChange={this.mappingConfSelectChange}
                        >
                            <Option value="entity">数据资产表</Option>
                        </Select>
                        <Label label='字段名' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8'}}>
                            <Tree
                                key='step_1_tree_2'
                                selectedKeys={MCTreeSelectValue[1][1]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(1, index, e, 1)}}
                            >
                                {this.renderTreeNodes(step1TreeData[1] || [])}
                            </Tree>
                        </div>
                    </Col>
                    <Col xl={3} style={{paddingTop: 94}}>
                        <Button type='primary' disabled={!(MCTreeSelectValue[1][0].length && MCTreeSelectValue[1][1].length)} onClick={()=>{this.addMCTreeSelect(1)}}>确定</Button>
                    </Col>
                    <Col xl={7}>
                        <Label label='概念/属性－字段名' hasBtn={<Tag color="red" onClick={this.cleanMCSelectDataStepOther}>清空</Tag>} />
                        <List
                            style={{width: '90%'}}
                            list={mappingSelectData[step]}
                        />
                    </Col>
                </Row>
            )
        }else if (step === 2) {
            return (
                <Row gutter={16}>
                    <Col xl={7} >
                        <Label label='关系列表' />
                        <Select style={{width: 250, marginBottom: 10}} onChange={this.mappingConfSelectChange}>
                            <Option value="entity">上一步选择的类型</Option>
                        </Select>
                        <Label label='包含实体1' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8'}}>

                        </div>
                    </Col>
                    <Col xl={7} >
                        <div style={{height: 68}}></div>

                        <Label label='包含实体2' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8'}}>

                        </div>
                    </Col>
                    <Col xl={3} style={{paddingTop: 94}}>
                        <Button type='primary'>确定</Button>
                    </Col>
                    <Col xl={7}>
                        <Label label='实体1－关系－实体2' hasBtn={<Tag color="red">清空</Tag>} />
                        <List
                            style={{width: 250}}
                            list={[{name:'qq',key:'qq'},{name:'3',key:'2'},{name:'22222222222223333333333333333333322222222222',key:'3'}]}
                        />
                    </Col>
                </Row>
            )
        }else if (step === 3) {
            return (
                <Row gutter={16}>
                    <Col xl={7} >
                        <Label label='概念列表' />
                        <Select style={{width: 250, marginBottom: 10}} onChange={this.mappingConfSelectChange}>
                            <Option value="entity">上一步选择的类型</Option>
                        </Select>
                        <Label label='属性/边属性' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8'}}>

                        </div>
                    </Col>
                    <Col xl={7} >
                        <Label label='数据表' />
                        <Select style={{width: 250, marginBottom: 10}} onChange={this.mappingConfSelectChange}>
                            <Option value="entity">数据资产表</Option>
                        </Select>
                        <Label label='字段名' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8'}}>

                        </div>
                    </Col>
                    <Col xl={3} style={{paddingTop: 94}}>
                        <Button type='primary'>确定</Button>
                    </Col>
                    <Col xl={7}>
                        <Label label='概念/属性/边属性－字段名' hasBtn={<Tag color="red">清空</Tag>} />
                        <List
                            style={{width: 250}}
                            list={[{name:'qq',key:'qq'},{name:'3',key:'2'},{name:'22222222222223333333333333333333322222222222',key:'3'}]}
                        />
                    </Col>
                </Row>
            )
        }

    }

    render(){
        const {currentStep, modalVisible, modalConfirmLoading, mappingConfStep, mappingSelectData} = this.props.dbAdd;
        return (
            <div>
                <Card
                    title='添加数据库信息'
                    body={
                        <Row gutter={16} >
                            <Col xl={5} xxl={4}>
                                <Steps direction="vertical" current={currentStep} style={{paddingTop: 50}}>
                                    <Step title="第一步" description="基本信息" style={{height: 170}} />
                                    <Step title="第二步" description="来源信息 （选填）" style={{height: 170}} />
                                    <Step title="第三步" description="Mapping定义 （选填）" style={{height: 115}} />
                                </Steps>
                            </Col>
                            <Col xl={19} xxl={20}>
                                <QueueAnim animConfig={[
                                        { opacity: [1, 0], translateY: [0, 50] },
                                        { opacity: [1, 0], translateY: [0, -50] }
                                    ]}
                                >
                                    <div style={{paddingTop: 50}} key={currentStep}>
                                        { currentStep===2?<Alert
                                            message="说明：请通过Mapping定义，确实数据对应关系。"
                                            type="info"
                                            closeText=" X "
                                            style={{
                                                width: '58%',
                                                marginLeft: '8.7%',
                                                marginBottom: 20
                                            }}
                                        />:null }
                                        <FormItemFactory
                                            formItemLayout={{
                                                labelCol: { span: 4 },
                                                wrapperCol: { span: 12 },
                                            }}
                                            noBtn={true}
                                            getFieldDecorator={this.props.form.getFieldDecorator}
                                            formList={FORM_ITEM_LIST[currentStep]}
                                        />
                                        <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12, offset: 4 }}>
                                            <Button type="primary" icon="check" style={{marginRight:'7%'}} onClick={this.onSubmit}>保存</Button>
                                            <Button icon="close" onClick={this.onClean}>清空</Button>
                                        </FormItem>
                                    </div>
                                </QueueAnim>
                            </Col>
                        </Row>
                    }
                />
                <Modal title='Mapping配置'
                    visible={modalVisible}
                    onOk={this.handleModalOk}
                    confirmLoading={modalConfirmLoading}
                    width='80%'
                    maskClosable={false}
                    destroyOnClose={true}
                    onCancel={this.handleModalCancel}
                    footer={
                        <div>
                            {mappingConfStep>0?<Button onClick={this.mappingConfPrev}>上一步</Button>:null}
                            <Button type='primary' onClick={()=>{this.mappingConfNext(mappingConfStep)}}>{mappingConfStep===3?'完成':'下一步'}</Button>
                        </div>
                    }
                >
                    <div>
                        <Steps current={mappingConfStep} progressDot>
                            <Step title="实体Mapping配置" />
                            <Step title="属性Mapping配置" />
                            <Step title="关系Mapping配置" />
                            <Step title="边属性Mapping配置" />
                        </Steps>
                        <Divider />
                        {
                            this.renderMappingConfChild(mappingConfStep, mappingSelectData)
                        }

                    </div>
                </Modal>
            </div>
        )
    }
}
