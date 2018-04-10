import { Table, Modal, message, Input, Popconfirm } from 'antd';

import { Link } from 'react-router-dom';

import Card from 'app_component/card';
import datafusionApi from 'app_api/datafusionApi';

const EditableCellInput = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);


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
            className: 'df-table-columns-line',
            render: (text, record) => this.renderColumns(text, record, 'jobName'),
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
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div>
                        {
                          editable ? <span>
                              <a onClick={() => this.updateSave(record.key)} style={{marginRight:10}}>保存</a>
                              <a onClick={() => this.updateCancel(record.key)}>取消</a>
                          </span>
                            : <span style={{color: '#3963b2',cursor: 'pointer'}}>
                                <span style={{marginRight: 15}} onClick={()=>{this.onClickStart(record)}}>启动</span>
                                <span style={{marginRight: 15}} onClick={()=>{this.onClickSuspend(record)}}>暂停</span>
                                <Popconfirm title="确定删除吗？" okText="确定" cancelText="取消" onConfirm={() => this.onClickDelete(record)}>
                                    <span style={{marginRight: 15}}>删除</span>
                                </Popconfirm>
                                <span style={{marginRight: 15}} onClick={()=>{this.onClickEdit(record)}}>修改</span>
                                <span onClick={()=>{this.onClickDetail(record)}}>详情</span>
                            </span>
                        }
                    </div>
                );
            }
        }];

        this.isEdit = false;
        this.lastTaskInfo = {};

        this.state = {
            dataSource: this.props.dataSource,
            current: 1
        }
    }

    componentWillReceiveProps(nextProps){

        this.setState({
            dataSource: nextProps.dataSource,
            current: 1
        })

        this.isEdit = false;
        this.lastTaskInfo = {};
    }

    renderColumns(text, record, column) {
        return (
            <EditableCellInput
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );

    }

    onClickStart = async(record) => {
        const result = await datafusionApi.resumeOne({taskId: record.taskId});
        message.success('启动成功');
    }

    onClickSuspend = async(record) => {
        const result = await datafusionApi.pauseOne({taskId: record.taskId});
        message.success('暂停成功');
    }

    updateSave = async(key) => {
        const data = [...this.state.dataSource];
        const result = await datafusionApi.updateOneInfo(data[key]);
        message.success('修改成功');
        delete data[key].editable;
        this.setState({
            dataSource: data
        })
        this.isEdit = false;
        this.lastTaskInfo = {};
    }

    updateCancel = async(key) => {
        const newData = [...this.state.dataSource];
        newData[key] = this.lastTaskInfo;
        this.setState({ dataSource: newData });
        this.isEdit = false;
        this.lastTaskInfo = {};
    }

    handleChange = (value, key, column) => {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataSource: newData });
        }
    }

    onClickDetail = async(record) => {
        const result = await datafusionApi.getDbItemEditInfo({mongoId: record.jobDataMapInfo.dataSourceId});
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

    onClickDelete = async(record) => {
        const data = [...this.state.dataSource];
        const result = await datafusionApi.taskDeleteOne({taskId: data[record.key].taskId});
        message.success('删除成功');
        data.splice(record.key, 1);
        data.map(item=>{
            if (item.key > record.key) {
                --item.key;
                --item.index;
            }
        })
        this.setState({
            dataSource: data
        })
    }

    onClickEdit = (record) => {

        if (this.isEdit) {
            message.info('编辑完上一条再说，你咋这么着急？');
        }else {
            this.isEdit = true;
            const data = [...this.state.dataSource];
            this.lastTaskInfo = {...data[record.key]};
            data[record.key].editable = true;
            this.setState({
                dataSource: data
            })
        }
    }

    tablePageChange = (key) => {
        this.setState({
            current: key
        })
    }

    render(){
        return(
            <Card
                title='任务列表'
                body={
                    <div style={{
                        maxHeight: 650,
                        overflow: 'auto'
                    }}>
                        <Table
                            dataSource={this.state.dataSource}
                            columns={this.columns}
                            bordered
                            pagination={
                                {
                                    current: this.state.current,
                                    onChange: this.tablePageChange
                                }
                            }
                            className='df-child01-table-class'
                        />
                    </div>
                }
            />
        )
    }
}
