import { Table } from 'antd';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';

export default class Child01 extends React.Component{

    constructor(props){
        super(props)

        //拿到页面类型，并拼接出跳转详情的PATH
        const {url: currentPath} = this.props.match;
        const matchUrlArr = currentPath.split('/').slice(1,4);
        this.matchUrl = matchUrlArr.join('/');

        this.columns = [{
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
            className: 'df-table-columns-line'
        }, {
            title: '数据内容',
            dataIndex: 'data',
            key: 'data',
            width: '80%',
            className: 'df-table-columns-line'
        },
        // {
        //     title: '文档名称',
        //     dataIndex: 'data',
        //     key: 'data',
        //     width: '35%',
        //     className: 'df-table-columns-line'
        // }, {
        //     title: '获取时间',
        //     dataIndex: 'getTime',
        //     key: 'getTime',
        //     className: 'df-table-columns-line'
        // }, {
        //     title: '抽取时间',
        //     dataIndex: 'extractTime',
        //     key: 'extractTime',
        //     className: 'df-table-columns-line'
        // }, {
        //     title: '抽取任务',
        //     dataIndex: 'knowledgeCount',
        //     key: 'knowledgeCount',
        //     className: 'df-table-columns-line'
        // }, {
        //     title: '文档来源',
        //     dataIndex: 'docuSource',
        //     key: 'docuSource',
        //     className: 'df-table-columns-line'
        // },
        {
            title: '操作',
            key: 'action',
            className: 'df-table-columns-line',
            render: (text, record) => (
                <span style={{color: '#3963b2',cursor: 'pointer'}}>
                    <span style={{marginRight: 15}} onClick={()=>{this.onClickDetail(record)}}>详情</span>
                    <span>删除</span>
                </span>
            )
        }];
    }

    onClickDetail = (e) => {
        this.props.history.push(`/${this.matchUrl}/detail/${e.dataId}`);
    }

    render(){
        return(
            <Card
                title='文档库'
                body={
                    <Table
                        dataSource={this.props.datasource}
                        columns={this.columns}
                        bordered
                        className='df-child01-table-class'
                    />
                }
            />
        )
    }
}
