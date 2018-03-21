import { Button, Form } from 'antd';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
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
        required:false
    },
    {
        label:'数据来源',
        key:'module_3',
        id:'module_3',
        type:'hasBtnSelect',
        options:[
            {
                label:'D2R',
                value:'D2R'
            }
        ],
        hasBtn:<Link to='/supermind/data/dml/edit/datasource'><Button style={{float: 'right', marginTop: 4}} type="dashed">修改</Button></Link>
    },
    {
        label:'模型定义',
        key:'module_4',
        id:'module_4',
        type:'hasBtnSelect',
        options:[
            {
                label:'D2R',
                value:'D2R'
            }
        ],
        hasBtn:<Link to='/supermind/data/dml/edit/modalconf'><Button style={{float: 'right', marginTop: 4}} type="dashed">修改</Button></Link>
    }
]

@Form.create()
export default class Child05 extends React.Component{

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
                    </div>
                }
            />
        )
    }
}
