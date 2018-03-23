import { Col, Row, Radio, Table, message } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import Card from 'app_component/card';

import datafusionApi from 'app_api/datafusionApi';

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
            source: 'database'
        }
        const result = await datafusionApi.getDbItemDetail(params);
        this.dataDetail = result.dataDetail;
        this.setState({
            dataDetail: JSON.stringify(this.dataDetail),
            dataSource: {event: result.knowledge.event, entity: result.knowledge.entity}
        })
    }

    radioOnChange = (e) => {
        const currentRadio = e.target.value;
        this.setState({
            radioValue: currentRadio
        })
    }

    handleFormatData = () => {
        this.setState({
            dataDetail: this.formatJson(this.dataDetail)
        })
    }

    formatJson = (msg) => {
        const rep = "~";
        let jsonStr = JSON.stringify(msg, null, rep)
        let str = "";
        for (let i = 0; i < jsonStr.length; i++) {
            const text2 = jsonStr.charAt(i)
            if (i > 1) {
                const text = jsonStr.charAt(i - 1)
                if (rep != text && rep == text2) {
                    str += "<br/>"
                }
            }
            str += text2;
        }
        jsonStr = "";
        for (let i = 0; i < str.length; i++) {
            const text = str.charAt(i);
            if (rep == text)
                jsonStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            else {
                jsonStr += text;
            }
            if (i == str.length - 2)
                jsonStr += "<br/>"
        }
        return jsonStr;
    }

    render(){
        return (
            <Row gutter={16} >
                <Col xl={10} xxl={8}>
                    <Card
                        title={<span>数据详情<span
                            onClick={this.handleFormatData}
                            style={{
                                float:'right',
                                fontSize: 14,
                                color: '#26468c',
                                fontWeight: 'normal',
                                cursor: 'pointer'
                            }}>格式化显示</span></span>
                        }
                        body={
                            <div style={{
                                maxHeight: 500,
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
                <Col xl={14} xxl={16}>
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
