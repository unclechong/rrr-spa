import { Steps, Form, Row, Col, Button, Alert, Modal, Divider, Select, Tag, Tree, message, Icon } from 'antd';
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
import WrapTree from 'app_component/tree';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
    [
        {
            label:'名称',
            id:'sourceName',
            key:'sourceName',
            type:'input'
        }, {
            label:'描述',
            key:'sourceDescription',
            id:'sourceDescription',
            type:'inputArea',
            required:false,
        }
    ], [
        {
            label:'任务名称',
            id:'jobName',
            key:'jobName',
            type:'input'
        }, {
            label:'任务类型',
            key:'jobType',
            id:'jobType',
            type:'select',
            options:[
                {
                    label:'全量任务',
                    value:'全量任务'
                }, {
                    label:'增量任务',
                    value:'增量任务'
                }
            ]
        }, {
            label:'文档类型',
            key:'docType',
            id:'docType',
            type:'select',
            options:[]
        }, {
            label:'API地址',
            key:'dataBusUrl',
            id:'dataBusUrl',
            type:'inputArea',
            required:true
        }
    ], [
        {
            label:'任务名称',
            id:'jobName2',
            key:'jobName2',
            type:'input'
        }, {
            label:'模型',
            key:'modelName',
            id:'modelName',
            type:'select',
            options:[
                {
                    label:'D2R',
                    value:'D2R'
                }
            ]
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
        FORM_ITEM_LIST[1][3].hasBtn = <Button style={{float: 'right'}} type="dashed" onClick={this.showExample}>样例数据</Button>;

        //左侧选择列表选中的的标签的信息{name:..., key:..., value:...}, 右侧选中的树需要将此列表拼接成需要的数据，上一步下一步将会被清空
        this.mappingConfTreeSplitArr = [];
        // 步骤一中，左侧树选中的节点的KEY，由于是多选，并且可以多次添加，由这个变量去校验左侧树的disable，在点击右侧清空按钮时一并清空
        this.selectableArr = [];
        // 步骤三保存需要的mapping配置中的数据
        this.step3PostNeedData = {}
    }

    componentDidMount(){
        // this.props.actions.startMappingConf();
    }

    componentWillUnmount(){
        this.props.actions.currentComponentLeave();
    }

    onSubmit = () => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    if (this.props.dbAdd.currentStep === 0) {
                        FORM_ITEM_LIST[1][2].options = [{label: values.sourceName, value: values.sourceName}]
                        this.props.actions.addNewDbNextStep({step: 1, data: {source: 'databaseSource', ...values}})
                    }else if (this.props.dbAdd.currentStep === 1) {
                        const {dataBusUrl, docType, jobName, jobType} = values;
                        const {id} = this.props.dbAdd.newTagData[0];
                        this.props.actions.addNewDbNextStep({step: 2, data: {
                            jobGroup: '数据微服务',
                            jobDescription: '',
                            jobType,
                            jobName,
                            jobDataMapInfo:{
                                docType,
                                source: 'databaseSource',
                                dataSourceId: id,
                                dataBusUrl
                            }
                        }})
                    }else if (this.props.dbAdd.currentStep === 2) {
                        if (Object.keys(this.step3PostNeedData).length) {
                            const {jobName2,modelName} = values;
                            const {jobType} = this.props.dbAdd.newTagData[1];
                            const {id} = this.props.dbAdd.newTagData[0];
                            this.props.actions.addNewDbNextStep({step: 3, data: {
                                jobName: jobName2,
                                jobGroup: '结构化数据',
                                jobDescription: '',
                                jobType,
                                jobDataMapInfo:{
                                    modelName,
                                    source: 'databaseSource',
                                    dataSourceId: id,
                                    d2rPattern: this.step3PostNeedData
                                }
                            },CB:()=>{
                                this.props.history.push('/supermind/data/db/list');
                                message.success('添加成功！')
                            }})
                        }else {
                            message.info('请进行mapping配置')
                        }
                    }
                }
            }
        );
    }

    showExample = () => {
        const dataBusUrl = this.props.form.getFieldValue('dataBusUrl');
        this.props.actions.showExample({data:{dataBusUrl,samplesTotal: '5'},CB:()=>{
            message.error('API地址不正确或者此API地址下没有样例数据')
        }})
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
        if (step === 3) {
            this.props.actions.triggerModal(false)
            this.step3PostNeedData = this.getD2rPatternData();

        }else {
            this.props.actions.mappingConfNext('next');

        }
    }

    getD2rPatternData = () => {
        const mappingData = this.props.dbAdd.mappingSelectData;
        let d2rPattern = {
            event:[],
            attribution:{},
            relationAttr:{}
        };
        const entityMap = [];
        const relationMap = [];
        d2rPattern.entity = mappingData[0].map((item, index)=>{
            entityMap.push(item.name);
            return {
                typeName: item.name,
                mongoId: item.value,
                id: index
            }
        })
        for (let i = 0; i < mappingData[1].length; i++) {
            const {entityName, typeName, fields, mongoId} = mappingData[1][i].formatData;

            const entityIndex = entityMap.indexOf(entityName);
            if (d2rPattern.attribution[entityIndex]) {
                d2rPattern.attribution[entityIndex].push({
                    typeName,
                    mongoId,
                    fields,
                    among: ' '
                })
            }else {
                d2rPattern.attribution[entityIndex] = [{
                    typeName,
                    mongoId,
                    fields,
                    among: ' '
                }]
            }
        }
        d2rPattern.relation = mappingData[2].map((item, index)=>{
            const {end, mongoId, typeName, start} = item.formatData;
            relationMap.push(typeName);
            return {
                typeName,
                mongoId,
                start:entityMap.indexOf(start),
                end:entityMap.indexOf(end),
                id:index
            }
        })
        for (let i = 0; i < mappingData[3].length; i++) {
            const {relationName, fields, typeName, mongoId} = mappingData[3][i].formatData;
            const relationIndex = relationMap.indexOf(relationName);
            if (d2rPattern.relationAttr[relationIndex]) {
                d2rPattern.relationAttr[relationIndex].push({
                    typeName,
                    mongoId,
                    fields,
                    among: ' '
                })
            }else {
                d2rPattern.relationAttr[relationIndex] = [{
                    typeName,
                    mongoId,
                    fields,
                    among: ' '
                }]
            }
        }
        return d2rPattern

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
            this.props.actions.onLoadStep1TreeData({treeNode,newTreeData:this.props.dbAdd.step0TreeData});
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
            const listArr = this.mappingConfTreeSplitArr.map(({props})=>({
                name: props.title,
                value: props.nodeValue,
                key: props.nodeValue
            }))
            this.props.actions.addMappingSelect({listArr, treeData: this.formatTreeData(false)});
        }else {
            const {MCSelectValue, mappingSelectData} = this.props.dbAdd;
            let addName = '';
            if (step === 2) {
                addName = MCSelectValue[step].label;
            }else {
                addName = MCSelectValue[step][0].label;
            }
            const [[firArr], [secArr]] = this.mappingConfTreeSplitArr;
            let listArr = null;
            if (step === 1) {
                listArr = [{
                    name: <span>{`${addName}/${firArr.props.title}`}<span style={{marginLeft: 20}}>{secArr.props.title}</span></span>,
                    value: `${firArr.key}|${secArr.key}`,
                    key: `${firArr.key}|${secArr.key}`,
                    formatData: {
                        entityName: addName,
                        typeName: firArr.props.title,
                        mongoId: firArr.key,
                        fields:[secArr.props.title]
                    }
                }]
            }else if(step === 2) {
                listArr = [{
                    name: `${firArr.props.title}（${addName} - ${secArr.props.title}）`,
                    value: `${firArr.key}|${secArr.key}`,
                    key: `${firArr.key}|${secArr.key}`,
                    treeData: firArr.props.attrList,
                    formatData: {
                        start: addName,
                        typeName: firArr.props.title,
                        end: secArr.props.title,
                        mongoId: firArr.key
                    }
                }]
            }else if(step === 3) {
                listArr = [{
                    name: <span>{`${addName}/${firArr.props.title}`}<span style={{marginLeft: 20}}>{secArr.props.title}</span></span>,
                    value: `${firArr.key}|${secArr.key}`,
                    key: `${firArr.key}|${secArr.key}`,
                    formatData: {
                        relationName: addName.split('（')[0],
                        typeName: firArr.props.title,
                        mongoId: firArr.key,
                        fields:[secArr.props.title]
                    }
                }]
            }

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

    modal2NextContent = (status) => {
        this.props.actions.modal2HandleContent({status})
    }

    handleModalCancel2 = () => {
        this.props.actions.hideModal2()
    }

    renderMappingConfChild = (step, mappingSelectData) => {
        const {selectTreeNode, step0TreeData, MCTreeSelectValue, step1TreeData, MCSelectValue,
            step2SelectOptionsData, step2TreeData, step3TreeData, newTagData} = this.props.dbAdd;
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
                            <Option value="0">实体</Option>
                        </Select>
                        <Label label='概念' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step0TreeData}
                                onLoadAction={this.props.actions.onLoadStep1TreeData}
                                multiple
                                selectedKeys={MCTreeSelectValue[0]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(0, index, e)}}
                            />

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
                            onChange={e=>{this.MCSelectChange(e,0)}}
                        >
                            {
                                mappingSelectData[0].map(opt=><Option value={opt.value} key={opt.key}>{opt.name}</Option>)
                            }
                        </Select>
                        <Label label='属性' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step1TreeData[0]}
                                key='step_1_tree'
                                selectedKeys={MCTreeSelectValue[1][0]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(1, index, e, 0)}}
                            />
                        </div>
                    </Col>
                    <Col xl={7}>
                        <Label label='数据表' />
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            key='step_1_select_2'
                            value={MCSelectValue[1][1]}
                            labelInValue
                            onChange={this.mappingConfSelectChange}
                        >
                            <Option value={newTagData[0].id}>{newTagData[0].sourceName}</Option>
                            {/* <Option value='5ab8929f1e36be17c06e4707'>测试</Option> */}
                        </Select>
                        <Label label='字段名' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step1TreeData[1]}
                                key='step_1_tree_2'
                                selectedKeys={MCTreeSelectValue[1][1]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(1, index, e, 1)}}
                            />
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
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            value={MCSelectValue[2]}
                            labelInValue
                            key='step_2_select'
                            onChange={e=>{this.MCSelectChange(e,0)}}
                        >
                            {
                                mappingSelectData[0].map(opt=><Option value={opt.value} key={opt.key}>{opt.name}</Option>)
                            }
                        </Select>
                        <Label label='关系' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step2TreeData[0]}
                                key='step_2_tree'
                                selectedKeys={MCTreeSelectValue[2][0]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(2, index, e, 0)}}
                            />
                        </div>
                    </Col>
                    <Col xl={7} >
                        <div style={{height: 68}}></div>

                        <Label label='包含实体2' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step2TreeData[1]}
                                key='step_2_tree_2'
                                selectedKeys={MCTreeSelectValue[2][1]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(2, index, e, 1)}}
                            />
                        </div>
                    </Col>
                    <Col xl={3} style={{paddingTop: 94}}>
                        <Button type='primary' disabled={!(MCTreeSelectValue[2][0].length && MCTreeSelectValue[2][1].length)} onClick={()=>{this.addMCTreeSelect(2)}}>确定</Button>
                    </Col>
                    <Col xl={7}>
                        <Label label='关系（实体1 － 实体2）' hasBtn={<Tag color="red" onClick={this.cleanMCSelectDataStepOther}>清空</Tag>} />
                        <List
                            style={{width: '90%'}}
                            list={mappingSelectData[step]}
                        />
                    </Col>
                </Row>
            )
        }else if (step === 3) {
            const _options = mappingSelectData[2].map(item=>{
                const _value = item.value.split('|')[0];
                return {
                    value: _value,
                    key: _value,
                    name: item.name
                }
            })
            return (
                <Row gutter={16}>
                    <Col xl={7} >
                        <Label label='关系列表' />
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            value={MCSelectValue[3][0]}
                            labelInValue
                            key='step_3_select'
                            onChange={e=>{this.MCSelectChange(e,0)}}
                        >
                            {
                                _options.map(opt=><Option value={opt.value} key={opt.key}>{opt.name}</Option>)
                            }
                        </Select>
                        <Label label='边属性' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step3TreeData[0]}
                                key='step_3_tree'
                                selectedKeys={MCTreeSelectValue[3][0]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(3, index, e, 0)}}
                            />
                        </div>
                    </Col>
                    <Col xl={7} >
                        <Label label='数据表' />
                        <Select
                            style={{width: 250, marginBottom: 10}}
                            key='step_3_select_2'
                            value={MCSelectValue[3][1]}
                            labelInValue
                            onChange={this.mappingConfSelectChange}
                        >
                            <Option value={newTagData[0].id}>{newTagData[0].sourceName}</Option>
                            {/* <Option value='5ab8929f1e36be17c06e4707'>测试</Option> */}
                        </Select>
                        <Label label='字段名' />
                        <div style={{height: 350,width: 250, border: '1px solid #e8e8e8', overflow: 'auto'}}>
                            <WrapTree
                                treeData={step3TreeData[1]}
                                key='step_3_tree_2'
                                selectedKeys={MCTreeSelectValue[3][1]}
                                onSelect={(index, e)=>{this.handelMCTreeSelect(3, index, e, 1)}}
                            />
                        </div>
                    </Col>
                    <Col xl={3} style={{paddingTop: 94}}>
                        <Button type='primary' disabled={!(MCTreeSelectValue[3][0].length && MCTreeSelectValue[3][1].length)} onClick={()=>{this.addMCTreeSelect(3)}}>确定</Button>
                    </Col>
                    <Col xl={7}>
                        <Label label='概念/边属性－字段名' hasBtn={<Tag color="red" onClick={this.cleanMCSelectDataStepOther}>清空</Tag>} />
                        <List
                            style={{width: '90%'}}
                            list={mappingSelectData[step]}
                        />
                    </Col>
                </Row>
            )
        }

    }

    render(){
        const {currentStep, modalVisible, modalConfirmLoading, mappingConfStep, mappingSelectData, modalVisible2,
                    modal2Data,modalCurrentConent} = this.props.dbAdd;
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
                <Modal title='样例数据'
                    key='example_modal'
                    visible={modalVisible2}
                    width='80%'
                    closable={false}
                    onCancel={this.handleModalCancel2}
                    footer={
                            <Button onClick={this.handleModalCancel2}>关闭</Button>
                    }
                >
                    <div style={{height: 500}}>

                        <div style={{height: 60}}>
                            <div style={{float: 'left'}}>
                                {`样例数据一共是${modal2Data.length}份，当前是第${modalCurrentConent+1}份`}
                            </div>
                            <Button.Group  style={{float: 'right'}}>
                                <Button type="primary" onClick={()=>{this.modal2NextContent('prev')}}>
                                    <Icon type="left" />上一份
                                </Button>
                                <Button type="primary" onClick={()=>{this.modal2NextContent('next')}}>
                                    下一份<Icon type="right" />
                                </Button>
                            </Button.Group>
                        </div>
                        <div style={{overflow: 'auto', height: 425}} dangerouslySetInnerHTML={{__html:modal2Data.length?modal2Data[modalCurrentConent].content:null}}></div>
                    </div>
                </Modal>
            </div>
        )
    }
}
