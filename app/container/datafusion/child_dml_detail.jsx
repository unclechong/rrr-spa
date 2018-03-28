import { Col, Row, Radio, Table, message } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import Card from 'app_component/card';

import datafusionApi from 'app_api/datafusionApi';


export default class Child12 extends React.Component{

    constructor(props){
        super(props)

        this.columns = [{
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
            className: 'df-table-columns-line'
        }, {
            title: '概念',
            dataIndex: 'concept',
            key: 'concept',
            className: 'df-table-columns-line'
        }, {
            title: '实例',
            dataIndex: 'entity',
            key: 'entity',
            className: 'df-table-columns-line'
        }, {
            title: '属性',
            dataIndex: 'attribution',
            key: 'attribution',
            className: 'df-table-columns-line'
        }, {
            title: '数值',
            dataIndex: 'attributionValue',
            key: 'attributionValue',
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

        this.dataDetail = null;

        this.state = {
            dataDetail: null,
            dataSource: [],
            radioValue: 'entity'
        }

    }

    async componentDidMount(){
        const params = {
            mongoId: this.props.match.params.id,
            source: 'documentSource'
        }
        const result = await datafusionApi.getDbItemDetail(params);
        this.setState({
            dataDetail: result.dataDetail.rawHtml,
            dataSource: {event: result.knowledge.event, entity: result.knowledge.entity}
        })
    }

    radioOnChange = (e) => {
        const currentRadio = e.target.value;
        this.setState({
            radioValue: currentRadio
        })
    }

    render(){
        return (
            <Row gutter={16} >
                <Col xl={12} xxl={12}>
                    <Card
                        title='文档详情'
                        body={
                            <div style={{
                                maxHeight: 600,
                                width: '100%',
                                border: '1px solid #d9d9d9',
                                padding: 10,
                                wordWrap: 'break-word',
                                overflow: 'auto'
                            }} dangerouslySetInnerHTML={{__html: this.state.dataDetail}}>
                            </div>
                        }
                    />
                </Col>
                <Col xl={12} xxl={12}>
                    <Card
                        title='提取知识'
                        body={
                            <div>
                                <RadioGroup value={this.state.radioValue} className='df-child01-radio-class' onChange={this.radioOnChange}>
                                    <RadioButton value="entity">实体</RadioButton>
                                    <RadioButton value="event">事件</RadioButton>
                                </RadioGroup>
                                <div style={{marginTop: 10}}>
                                    <Table
                                        dataSource={this.state.dataSource[this.state.radioValue]}
                                        columns={this.columns}
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
