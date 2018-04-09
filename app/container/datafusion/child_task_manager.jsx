import { Table, Modal } from 'antd';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import datafusionApi from 'app_api/datafusionApi';

export default class Child extends React.Component{

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
                    <span onClick={()=>{this.onClickDetail(record)}}>详情</span>
                </span>
            )
        }];

        this.state = {

        }
    }

    onClickDetail = async(record) => {

        const result = await datafusionApi.getDbItemEditInfo({mongoId: '5abcb0551e36be289834486a'});
        console.log(result);
        let obj = [];
        if (this.props.activeTag === '数据微服务') {
            const {jobName, jobType, docType, dataBusUrl} = result.dataBusTaskInfo;
            obj =[{
                name: '任务名称',
                value: jobName
            },{
                name: '任务类型',
                value: jobType
            },{
                name: '文档类型',
                value: docType
            },{
                name: 'API地址',
                value: dataBusUrl
            }];
        }else {
            const {jobName, jobType, modelName} = result.dataProcessingTaskInfo;
            obj =[{
                name: '任务名称',
                value: jobName
            },{
                name: '任务类型',
                value: jobType
            },{
                name: '模型定义',
                value: modelName
            }];
        }
        Modal.info({
            title: '任务详情',
            okText: '关闭',
            style:{padding: '0 20px'},
            content: (
                <div>
                    {
                        obj.map((item, index)=>{
                            return <p key={index}>
                                <span>{item.name}：</span>
                                <span style={{wordWrap:'break-word'}}>{item.value}</span>
                            </p>
                        })
                    }
                </div>
            ),
            onOk() {},
        });
    }

    render(){
        return(
            <Card
                title='任务列表'
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
