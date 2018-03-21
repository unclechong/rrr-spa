import { Button, Form, Alert } from 'antd';
import QueueAnim from 'rc-queue-anim';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

const FORM_ITEM_LIST = [
    {
        label:'任务名称',
        id:'task_name_3',
        key:'task_name_3',
        type:'input'
    }, {
        label:'模型定义',
        key:'module_3',
        id:'module_3',
        type:'hasBtnSelect',
        options:[
            {
                label:'D2R',
                value:'D2R'
            }
        ],
        hasBtn:<Button style={{float: 'right', marginTop: 4}} type="dashed">确定</Button>
    }
]

@Form.create()
export default class Child07 extends React.Component{

    render(){
        return(
            <QueueAnim animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                ]}
            >
                <Card
                    key='child_dml_edit_3'
                    title='文档库信息编辑'
                    body={
                        <div>
                            <Alert
                                message="说明：请从已有的模型库中选取相应的模型，每一个模型都会生成一个任务。"
                                type="info"
                                closeText=" X "
                                style={{
                                    width: '58%',
                                    marginLeft: '8.7%',
                                    marginBottom: 20
                                }}
                            />
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
