import { Steps, Form, Row, Col, Button, Alert } from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;

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

@Form.create()
export default class Child03 extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            currentStep: 0
        }
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

    onClean = () => {

    }

    render(){
        const {currentStep} = this.state;
        return (
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
        )
    }
}
