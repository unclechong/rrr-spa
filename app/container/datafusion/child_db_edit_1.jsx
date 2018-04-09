import { Button, Form } from 'antd';

import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
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
        required:false
    },
    {
        label:'数据来源',
        key:'jobName',
        id:'jobName',
        type:'hasBtnSelect',
        options:[]
    },
    {
        label:'模型定义',
        key:'modelName',
        id:'modelName',
        type:'hasBtnSelect',
        options:[]
    }
]

@Form.create()
export default class Child01 extends React.Component{

    constructor(props){
        super(props);
        FORM_ITEM_LIST[2].hasBtn = <Button style={{float: 'right', marginTop: 4}} type="dashed" onClick={()=>{this.props.onClickNext({step:2})}}>查看</Button>
        FORM_ITEM_LIST[3].hasBtn = <Button style={{float: 'right', marginTop: 4}} type="dashed" onClick={()=>{this.props.onClickNext({step:3})}}>查看</Button>
    }

    componentDidMount(){
        const tagEditData = this.props.dataSource;
        if(Object.keys(tagEditData).length){
            const {sourceName, sourceDescription, dataBusTaskInfo:{jobName}, dataProcessingTaskInfo:{modelName}} = tagEditData;
            FORM_ITEM_LIST[2].options = [{label:jobName,value:jobName,key:111}];
            FORM_ITEM_LIST[3].options = [{label:modelName,value:modelName,key:222}];

            const params = {
                sourceName,
                sourceDescription,
                jobName:jobName,
                modelName:modelName
            }
            this.props.form.setFieldsValue(params)
        }
    }



    render(){
        return(
            <Card
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
