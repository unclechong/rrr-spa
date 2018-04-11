import { Button, Form, message } from 'antd';
const FormItem = Form.Item;

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

import datafusionApi from 'app_api/datafusionApi';

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

        this.mongoId = '';
        this.oldFormData = {};
    }

    componentDidMount(){
        const tagEditData = this.props.dataSource;
        this.mongoId = tagEditData.mongoId;
        if(Object.keys(tagEditData).length){
            const {sourceName, sourceDescription, dataBusTaskInfo:{jobName}, dataProcessingTaskInfo} = tagEditData;
            FORM_ITEM_LIST[2].options = [{label:jobName,value:jobName,key:111}];
            FORM_ITEM_LIST[3].options = [{label:dataProcessingTaskInfo?dataProcessingTaskInfo.modelName:'',value:dataProcessingTaskInfo?dataProcessingTaskInfo.modelName:'',key:222}];

            const params = {
                sourceName,
                sourceDescription,
                jobName:jobName,
                modelName:dataProcessingTaskInfo?dataProcessingTaskInfo.modelName:''
            }
            this.oldFormData = params;
            this.props.form.setFieldsValue(params)
        }
    }

    handleSave = async() => {
        const {sourceName, sourceDescription} = this.props.form.getFieldsValue();
        if (sourceName + '|||' + sourceDescription === this.oldFormData.sourceName + '|||' + this.oldFormData.sourceDescription){
            message.info('你改了吗？就要保存？');
            return
        }
        const result = await datafusionApi.updateOne({sourceName, sourceDescription, mongoId: this.mongoId});
        this.oldFormData = {sourceName, sourceDescription};
        message.success('更新成功');
    }

    render(){
        return(
            <Card
                title='文档库信息编辑'
                body={
                    <div>
                        <FormItemFactory
                            noBtn={true}
                            getFieldDecorator={this.props.form.getFieldDecorator}
                            formList={FORM_ITEM_LIST}
                        />
                        <FormItem
                            wrapperCol={{ span: 12, offset: 4 }}
                        >
                            <Button type="primary" onClick={this.handleSave}>确定</Button>
                        </FormItem>
                    </div>
                }
            />
        )
    }
}
