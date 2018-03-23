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
        options:[],
        hasBtn:<Link to='/supermind/data/db/edit/sourceinfo'><Button style={{float: 'right', marginTop: 4}} type="dashed">修改</Button></Link>
    },
    {
        label:'模型定义',
        key:'modelName',
        id:'modelName',
        type:'hasBtnSelect',
        options:[],
        hasBtn:<Link to='/supermind/data/db/edit/mappingconf'><Button style={{float: 'right', marginTop: 4}} type="dashed">修改</Button></Link>
    }
]

const mapStateToProps = state => {
    return {datafusion: state.get('datafusion').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});


const bindFieldValues = (FORM_ITEM_LIST,props) => {
    let fieldObj = {};
        FORM_ITEM_LIST.map(formItem=>{
            fieldObj[formItem.id] = Form.createFormField({
                ...props.datafusion.formData['step1'][formItem.id]
            })
        })
    return fieldObj
}

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
    onFieldsChange(props, changedFields) {
        props.actions.mergeFieldsValues({index:'1',data:changedFields});
    },
    mapPropsToFields(props) {
        return bindFieldValues(FORM_ITEM_LIST,props)
    }
})
export default class Child05 extends React.Component{

    componentDidMount(){
        const {tagEditData} = this.props.datafusion;
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
            console.log(params,FORM_ITEM_LIST);
            this.props.actions.setFieldsValues({index:'step1',data:params})
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
