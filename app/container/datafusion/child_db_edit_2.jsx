import { Button, Form } from 'antd';
import QueueAnim from 'rc-queue-anim';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
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
]

@Form.create()
export default class Child09 extends React.Component{

    render(){
        return(
            <QueueAnim animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                ]}
            >
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
            </QueueAnim>
        )
    }
}
