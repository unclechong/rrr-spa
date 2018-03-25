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
        label:'模型',
        key:'modelName',
        id:'modelName',
        type:'hasBtnSelect',
        options:[],
        hasBtn:<Button style={{float: 'right', marginTop: 4}} type="dashed">样例数据</Button>
    }, {
        label:'映射关系',
        key:'mapping_3',
        id:'mapping_3',
        type:'button',
        buttonName:'Mapping管理'
    }
]

@Form.create()
export default class Child03 extends React.Component{

    componentDidMount(){
        const tagEditData = this.props.dataSource;
        if(Object.keys(tagEditData).length){
            const {modelName, jobName} = tagEditData;
            FORM_ITEM_LIST[0].options = [{label:jobName,value:jobName,key:111}];
            FORM_ITEM_LIST[1].options = [{label:modelName,value:modelName,key:222}];

            const params = {modelName, jobName};
            this.props.form.setFieldsValue(params)
        }
    }

    render(){
        return(
            <Card
                key='child_dml_edit_3'
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
