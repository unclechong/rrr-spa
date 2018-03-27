import { Steps, Form, Row, Col, Button, Alert, Modal, Divider, Select, Tag, Tree, message } from 'antd';
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
            label:'模型定义',
            key:'module_3',
            id:'module_3',
            type:'hasBtnSelect',
            options:[
                {
                    label:'D2R',
                    value:'D2R'
                }
            ],
            hasBtn:<Button style={{float: 'right', marginTop: 4}} type="dashed">确定</Button>
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
                    if (this.props.dmlAdd.currentStep !== 2) {
                        this.props.actions.addNewDmlNextStep()
                    }
                }
            }
        );
    }

    render(){
        const {currentStep} = this.props.dmlAdd;
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
            </div>
        )
    }
}
