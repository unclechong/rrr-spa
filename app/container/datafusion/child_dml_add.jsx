import { Steps, Form, Row, Col, Button, Alert, Modal, Divider, Select, Tag, Tree, message, Icon } from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';
import QueueAnim from 'rc-queue-anim';

import Card from 'app_component/card';
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
            options:[]
        }
    ]
]


const mapStateToProps = state => {
    return {dmlAdd: state.get('datafusionChildDmlAdd').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
export default class Child04 extends React.Component{

    constructor(props){
        super(props)

        //bind mapping conf btn callback
        FORM_ITEM_LIST[1][3].hasBtn = <Button style={{float: 'right'}} type="dashed" onClick={this.showExample}>样例数据</Button>;

    }

    componentWillUnmount(){
        this.props.actions.currentDmlComponentLeave();
    }

    onSubmit = () => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    if (this.props.dmlAdd.currentStep === 0) {
                        FORM_ITEM_LIST[1][2].options = [{label: values.sourceName, value: values.sourceName}]
                        this.props.actions.addNewDmlNextStep({step: 1, data: {source: 'documentSource', ...values}})
                    }else if (this.props.dmlAdd.currentStep === 1) {
                        const {dataBusUrl, docType, jobName, jobType} = values;
                        const {id} = this.props.dmlAdd.newTagData[0];
                        this.props.actions.addNewDmlNextStep({step: 2, data: {
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
                        },CB:(opts)=>{
                            FORM_ITEM_LIST[2][1].options = opts.map(item=>({value:item.id,label:item.description,key:item.id}))
                        }})
                    }else if(this.props.dmlAdd.currentStep === 2){
                        const {jobName, jobType} = this.props.dmlAdd.newTagData[1];
                        const {id} = this.props.dmlAdd.newTagData[0];

                        this.props.actions.addNewDmlNextStep({step: 3, data: {
                        	jobName: values.jobName2,
                        	jobType,
                        	jobGroup:"非结构化数据",
                        	jobDescription:"",
                        	jobDataMapInfo:{
                        		modelName: values.modelName,
                        		modelId:"",
                        		source:"documentSource",
                        		dataSourceId: id,
                                pipelineId: values.modelName
                        	}
                        },CB:()=>{
                            this.props.history.push('/supermind/data/dml/list');
                            message.success('添加成功！')
                        }})
                    }
                }
            }
        );
    }

    showExample = () => {
        const dataBusUrl = this.props.form.getFieldValue('dataBusUrl');
        this.props.actions.dmlAddshowExample({data:{dataBusUrl,samplesTotal: '5'},CB:()=>{
            message.error('API地址不正确或者此API地址下没有样例数据')
        }})
    }

    handleModalCancel2 = () => {
        this.props.actions.dmlAddHideExample()
    }

    modalNextContent = (status) => {
        this.props.actions.modalHandleContent({status})
    }

    render(){
        const {currentStep, modalVisible, modalData, modalCurrentConent} = this.props.dmlAdd;
        return (
            <div>
                <Card
                    title='添加文档库信息'
                    body={
                        <Row gutter={16} >
                            <Col xl={5} xxl={4}>
                                <Steps direction="vertical" current={currentStep} style={{paddingTop: 50}}>
                                    <Step title="第一步" description="基本信息" style={{height: 170}} />
                                    <Step title="第二步" description="来源信息 （选填）" style={{height: 170}} />
                                    <Step title="第三步" description="模型定义 （选填）" style={{height: 115}} />
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
                                            message="说明：请从已有的模型库中选取相应的模型，每一个模型都会生成一个任务。"
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
                <Modal title='样例数据'
                    key='example_modal'
                    visible={modalVisible}
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
                                {`样例数据一共是${modalData.length}份，当前是第${modalCurrentConent+1}份`}
                            </div>
                            <Button.Group  style={{float: 'right'}}>
                                <Button type="primary" onClick={()=>{this.modalNextContent('prev')}}>
                                    <Icon type="left" />上一份
                                </Button>
                                <Button type="primary" onClick={()=>{this.modalNextContent('next')}}>
                                    下一份<Icon type="right" />
                                </Button>
                            </Button.Group>
                        </div>
                        <div style={{overflow: 'auto', height: 425}} dangerouslySetInnerHTML={{__html:modalData.length?modalData[modalCurrentConent].content:null}}></div>
                    </div>
                </Modal>
            </div>
        )
    }
}
