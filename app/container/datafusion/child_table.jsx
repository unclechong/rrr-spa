import { Table } from 'antd';
import { Link } from 'react-router-dom';

import Card from 'app_component/card';

const dataSource = [{
    key:'1',
    index: '1',
    docuName: '胡彦斌32444444444444444444444444444444444444444444444444444444444',
    getTime: '1993-01-02',
    extractTime: '12121',
    extractTask: '1sadsdasdas',
    docuSource: 'asdasdasd',
}, {
    key:'2',
    index: '2',
    docuName: '胡彦斌',
    getTime: 32,
    extractTime: '12121',
    extractTask: '1sadsdasdas',
    docuSource: 'asdasdasd',
}];

export default class Child01 extends React.Component{

    constructor(props){
        super(props)

        //拿到页面类型，并拼接出跳转详情的PATH
        const {url: currentPath} = this.props.match;
        const matchUrlArr = currentPath.split('/').slice(1,4);
        const matchUrl = matchUrlArr.join('/');
        this.pageType = matchUrlArr[2];
        const column = this.pageType === 'db'?{
            title: '抽取知识',
            dataIndex: 'extractTask',
            key: 'extractTask',
            className: 'df-table-columns-line'
        }:{
            title: '抽取任务',
            dataIndex: 'extractTask',
            key: 'extractTask',
            className: 'df-table-columns-line'
        }

        this.columns = [{
            title: 'NO',
            dataIndex: 'index',
            key: 'index',
            className: 'df-table-columns-line'
        }, {
            title: '文档名称',
            dataIndex: 'docuName',
            key: 'docuName',
            width: '35%',

            className: 'df-table-columns-line'
        }, {
            title: '获取时间',
            dataIndex: 'getTime',
            key: 'getTime',
            className: 'df-table-columns-line'
        }, {
            title: '抽取时间',
            dataIndex: 'extractTime',
            key: 'extractTime',
            className: 'df-table-columns-line'
        }, column, {
            title: '文档来源',
            dataIndex: 'docuSource',
            key: 'docuSource',
            className: 'df-table-columns-line'
        }, {
            title: '操作',
            key: 'action',
            className: 'df-table-columns-line',
            render: (text, record) => (
                <span style={{color: '#3963b2',cursor: 'pointer'}}>
                    <span style={{marginRight: 15}}><Link to={`/${matchUrl}/detail`}>详情</Link></span>
                    <span>删除</span>
                </span>
            )
        }];
    }

    render(){
        return(
            <Card
                title={this.pageType==='db'?'数据列表':'文档库'}
                body={
                    <Table
                        dataSource={dataSource}
                        columns={this.columns}
                        bordered
                        className='df-child01-table-class'
                    />
                }
            />
        )
    }
}
