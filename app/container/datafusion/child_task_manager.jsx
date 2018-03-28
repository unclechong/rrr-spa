import { Table } from 'antd';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';

export default class Child01 extends React.Component{

    constructor(props){
        super(props)

        this.columns = [{
            title: 'NO',
            dataIndex: 'index',
            key: 'index',
            width:'8%',
            className: 'df-table-columns-line'
        }, {
            title: '任务名称',
            dataIndex: 'jobName',
            key: 'jobName',
            width: '15%',
            className: 'df-table-columns-line'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '15%',
            className: 'df-table-columns-line'
        }, {
            title: '执行次数',
            dataIndex: 'total',
            key: 'total',
            width: '8%',
            className: 'df-table-columns-line'
        }, {
            title: '最后执行时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: '15%',
            className: 'df-table-columns-line'
        }, {
            title: '任务状态',
            dataIndex: 'jobStatus',
            key: 'jobStatus',
            className: 'df-table-columns-line'
        }, {
            title: '操作',
            key: 'action',
            width: '25%',
            className: 'df-table-columns-line',
            render: (text, record) => (
                <span style={{color: '#3963b2',cursor: 'pointer'}}>
                    <span style={{marginRight: 15}} onClick={()=>{this.onClickDetail(record)}}>启动</span>
                    <span style={{marginRight: 15}} onClick={()=>{this.onClickDetail(record)}}>暂停</span>
                    <span style={{marginRight: 15}} onClick={()=>{this.onClickDetail(record)}}>删除</span>
                    <span style={{marginRight: 15}} onClick={()=>{this.onClickDetail(record)}}>修改</span>
                    <span style={{marginRight: 15}} onClick={()=>{this.onClickDetail(record)}}>详情</span>
                </span>
            )
        }];
    }

    render(){
        return(
            <Card
                title='数据列表'
                body={
                    <Table
                        dataSource={this.props.dataSource}
                        columns={this.columns}
                        bordered
                        className='df-child01-table-class'
                    />
                }
            />
        )
    }
}
