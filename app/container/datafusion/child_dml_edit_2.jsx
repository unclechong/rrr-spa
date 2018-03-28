import { Button, Form, Modal, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';
import datafusionApi from 'app_api/datafusionApi';

const FORM_ITEM_LIST = [
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
        options:[]
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
        type:'hasBtnInputArea',
        required:true
    }
]

@Form.create()
export default class Child02 extends React.Component{

    constructor(props){
        super(props)

        FORM_ITEM_LIST[3].hasBtn = <Button style={{float: 'right'}} type="dashed" onClick={this.showExample}>样例数据</Button>;

        this.state = {
            modalCurrentConent: 0,
            modalData: [],
            modalVisible: false
        }
    }

    showExample = async () => {
        const dataBusUrl = this.props.form.getFieldValue('dataBusUrl');
        const params = {
            dataBusUrl,
            samplesTotal: 5
        }
        const data = await datafusionApi.getOneSamples(params)
        this.setState({modalData:data,modalVisible:true})
    }

    componentDidMount(){
        const tagEditData = this.props.dataSource;
        if(Object.keys(tagEditData).length){
            const {dataBusUrl, docType, jobName, jobType} = tagEditData;
            FORM_ITEM_LIST[1].options = [{label:jobType,value:jobType,key:111}];
            FORM_ITEM_LIST[2].options = [{label:docType,value:docType,key:222}];

            const params = {dataBusUrl, docType, jobName, jobType};
            this.props.form.setFieldsValue(params)
        }
    }

    modalNextContent = (todo) => {
        const {modalCurrentConent,modalData} = this.state;
        if (modalCurrentConent !== 0 && todo === 'prev') {
            this.setState({modalCurrentConent: modalCurrentConent-1})
        }else if (modalCurrentConent !== modalData.length-1 && todo === 'next') {
            this.setState({modalCurrentConent: modalCurrentConent+1})
        }
    }

    handleModalCancel2 = () => {
        this.setState({modalVisible: false, modalCurrentConent: 0})
    }

    render(){
        const {modalVisible,modalData,modalCurrentConent} = this.state;
        return(
            <div>
                <Card
                    key='child_dml_edit_2'
                    title='数据库信息编辑'
                    body={
                        <div>
                            <FormItemFactory
                                noBtn={true}
                                getFieldDecorator={this.props.form.getFieldDecorator}
                                formList={FORM_ITEM_LIST}
                            />
                        </div>
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
