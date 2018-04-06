import { Col, Row, Table, message } from 'antd';

import Card from 'app_component/card';

export default class Child extends React.Component{

    constructor(props){
        super(props)

        this.columns = [{
            title: '实例名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc'
        }];

        this.columns2 = [{
            title: '属性名称',
            dataIndex: 'atteName',
            key: 'atteName'
        }, {
            title: '属性值',
            dataIndex: 'atteValue',
            key: 'atteValue'
        }];

        this.state = {
            table2Data: [],
            currentAttrName: ''
        }
    }

    componentDidMount(){
        if (this.props.tableData.length) {
            const data = this.props.tableData[0];
            this.tableRowOnClick(data)

        }
    }

    tableRowOnClick = (record) => {
        const {attr, name: currentAttrName} = record;
        let table2Data = [];

        for (let key in attr) {
            table2Data.push({
                atteName: key,
                atteValue: attr[key],
                key: key
            })
        }
        this.setState({
            currentAttrName,
            table2Data
        })
    }

    render(){
        return (
            <Row gutter={16} >
                <Col xl={12} xxl={12}>
                    <Card
                        title='实例列表'
                        body={
                            <Table
                                onRow={(record) => {
                                    return {
                                        onClick: ()=>{this.tableRowOnClick(record)},       // 点击行
                                    };
                                }}
                                dataSource={this.props.tableData}
                                columns={this.columns}
                                bordered
                            />
                        }
                    />
                </Col>
                <Col xl={12} xxl={12}>
                    {
                        this.state.table2Data.length?<Card
                            title={`${this.state.currentAttrName} - 属性列表`}
                            body={
                                <Table
                                    dataSource={this.state.table2Data}
                                    columns={this.columns2}
                                    bordered
                                />
                            }
                        />:null
                    }
                </Col>
            </Row>
        )
    }
}
