import { Button, Form } from 'antd';

import QueueAnim from 'rc-queue-anim';
import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
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
            </QueueAnim>
        )
    }
}
