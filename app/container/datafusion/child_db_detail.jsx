import { Col, Row, Radio, Table } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import Card from 'app_component/card';

const columns = [{
    title: 'NO',
    dataIndex: 'index',
    key: 'index',
    className: 'df-table-columns-line'
}, {
    title: '概念',
    dataIndex: 'concept',
    key: 'concept',
    className: 'df-table-columns-line'
}, {
    title: '实例',
    dataIndex: 'instance',
    key: 'instance',
    className: 'df-table-columns-line'
}, {
    title: '属性',
    dataIndex: 'prop',
    key: 'prop',
    className: 'df-table-columns-line'
}, {
    title: '数值',
    dataIndex: 'value',
    key: 'value',
    className: 'df-table-columns-line'
}, {
    title: '操作',
    key: 'action',
    className: 'df-table-columns-line',
    render: (text, record) => (
        <span style={{color: '#3963b2',cursor: 'pointer'}}>
            <span>纠错</span>
        </span>
    )
}];

const dataSource = [{
    key:'1',
    index: '1',
    concept: '胡彦斌32444444444',
    instance: '1993-01-02',
    prop: '12121',
    value: '1sadsdasdas',
}, {
    key:'2',
    index: '2',
    concept: '2323',
    instance: '1993-01-02',
    prop: '12121',
    value: '1sadsdasdas',
}];


export default class Child02 extends React.Component{

    render(){
        return (
            <Row gutter={16} >
                <Col xl={10} xxl={8}>
                    <Card
                        title='数据详情'
                        body={
                            <div style={{
                                height: 400,
                                width: '100%',
                                border: '1px solid #d9d9d9',
                                padding: 10
                            }}>
                                key -- value
                            </div>
                        }
                    />
                </Col>
                <Col xl={14} xxl={16}>
                    <Card
                        title='提取知识'
                        body={
                            <div>
                                <RadioGroup defaultValue="entity" className='df-child01-radio-class'>
                                    <RadioButton value="entity">实体</RadioButton>
                                    <RadioButton value="event">事件</RadioButton>
                                </RadioGroup>
                                <div style={{marginTop: 10}}>
                                    <Table
                                        dataSource={dataSource}
                                        columns={columns}
                                        bordered
                                        className='df-child01-table-class'
                                    />
                                </div>
                            </div>
                        }
                    />
                </Col>
            </Row>
        )
    }
}

// md	≥768px
// lg	≥992px
// xl	≥1200px
