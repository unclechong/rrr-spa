import { Col, Row, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class Child02 extends React.Component{

    render(){
        return (
            <Row gutter={16} >
                <Col xl={10} xxl={8}>
                    <div className='dd-mainarea-right-body'>
                        <div className='dd-mainarea-right-body-title'>数据详情</div>
                    </div>
                </Col>
                <Col xl={14} xxl={16}>
                    <div className='dd-mainarea-right-body'>
                        <div className='dd-mainarea-right-body-title'>提取知识</div>
                        <div>
                            <RadioGroup defaultValue="entity" className='df-child01-radio-class'>
                                <RadioButton value="entity">实体</RadioButton>
                                <RadioButton value="event">事件</RadioButton>
                            </RadioGroup>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

// md	≥768px
// lg	≥992px
// xl	≥1200px
