import { Button, Form } from 'antd';
import QueueAnim from 'rc-queue-anim';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

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
        required:true,
        hasBtn:<Button style={{float: 'right'}} type="dashed">样例数据</Button>
    }
]

@Form.create()
export default class Child02 extends React.Component{

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

    render(){
        return(
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
        )
    }
}
