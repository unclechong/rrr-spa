import { Button, Form, Table } from 'antd';

import QueueAnim from 'rc-queue-anim';

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
        type:'select',
        options:[]
    }, {
        label:'映射关系',
        key:'mapping_3',
        id:'mapping_3',
        type:'button',
        buttonName:'Mapping管理'
    }
]

const TABLE_COULMNS = [
    {
        title:'NO',
        key:'index',
        dataIndex:'index',
        className: 'df-table-columns-line',
        width: '8%'
    },{
        title:'类型',
        key:'type',
        dataIndex:'type',
        width: '10%',
        className: 'df-table-columns-line'
    },{
        title:'描述',
        key:'desc',
        dataIndex:'desc',
        className: 'df-table-columns-line'
    }
]

const TABLE_DATA = [{
    key:'entity',
    index: '1',
    type: '实体',
    desc: null
}, {
    key:'attribution',
    index: '2',
    type: '属性',
    desc: null
}, {
    key:'relation',
    index: '3',
    type: '关系',
    desc: null
}, {
    key:'relationAttr',
    index: '4',
    type: '边属性',
    desc: null
}]


@Form.create()
export default class Child03 extends React.Component{

    constructor(props){
        super(props)
        FORM_ITEM_LIST[2].onClick = this.showMappingTable;

        this.state = {
            visible: true
        }
    }

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

    showMappingTable = () => {
        this.setState((prev)=>{
            return {
                visible: !prev.visible
            }
        })
    }

    render(){
        const dataSource = this.props.dataSource;
        TABLE_DATA.map(item=>{
            item.desc = _.join(dataSource.tableData[item.key],'; ');
        })
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
                        <QueueAnim>
                            {this.state.visible?<Table
                                key={this.state.visible}
                                style={{width:'80%',marginLeft:'10%'}}
                                dataSource={TABLE_DATA}
                                columns={TABLE_COULMNS}
                                bordered
                                className='df-child01-table-class'
                            />:null}
                        </QueueAnim>
                    </div>

                }
            />
        )
    }
}
