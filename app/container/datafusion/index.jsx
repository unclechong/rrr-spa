import { Collapse, Icon, Button, message, Popconfirm } from 'antd';
const Panel = Collapse.Panel;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';
import { Route, Switch, Redirect } from 'react-router-dom';
import { List as List_I } from 'immutable';

import PageContainer from 'app_component/pagecontainer';
import WrapTabs from 'app_component/tabs';
import TagList from 'app_component/taglist';
import WrapTree from 'app_component/tree';

import Child01 from './child_db_list.jsx';
import Child02 from './child_db_detail.jsx';
import Child03 from './child_db_add.jsx';
import Child08 from './child_db_edit.jsx';

import Child11 from './child_dml_list.jsx';
import Child12 from './child_dml_detail.jsx';
import Child04 from './child_dml_add.jsx';
import Child05 from './child_dml_edit.jsx';

import TaskManager from './child_task_manager.jsx';

import './index.css';

const TAB_LIST = [
    {
        name: '数据源',
        key: 'dataSource'
    }, {
        name: '任务管理',
        key: 'taskManage'
    }
];

const TASK_LIST_MAP = [
    {key:'非结构化数据',label:'图谱构建（文档库）',value:'非结构化数据'},
    {key:'结构化数据',label:'图谱构建（数据库）',value:'结构化数据'},
    {key:'数据微服务',label:'数据汇聚',value:'数据微服务'},
]

const mapStateToProps = state => {
    return {datafusion: state.get('datafusion').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class DataFusion extends React.Component{
    constructor(props){
        super(props)

    }

    componentDidMount(){
        this.props.actions.initDataFusion();
        const pathArr = this.props.location.pathname.split('/');
        if (_.last(pathArr) === 'add') {
            const _path = pathArr.slice(0,pathArr.length-1).join('/');
            this.goPage(`${_path}/list`);
        }
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
    }


    // 类型, id, key
    handleTreeOnSelect = (type, value, index) => {
        const jumpPath = `${this.props.match.path+'/'+type}/list`;
        this.goPage(jumpPath);
        //不能进行反选
        if (index.length) {
            this.props.actions.changeTreeSelect({index,value});
        }
    }

    handleAddTreeItem = (e, type) => {
        e.stopPropagation();
        const jumpPath = `${this.props.match.path+'/'+type}/add`;
        this.goPage(jumpPath);
        this.props.actions.changeTreeSelectNoData({index: [], value: null});
    }

    handleTagEdit = (e,type,value) => {
        e.stopPropagation();
        const _type = type[0].substring(0,1)==='1'?'db':'dml';
        const jumpPath = `${this.props.match.path+'/'+_type}/edit/${value}`;
        this.goPage(jumpPath);
        // this.props.actions.handleTagEdit();
    }

    handleTagDelete = (e,type,value) => {
        e.stopPropagation();
        const jumpPath = `${this.props.match.path}/none`;
        this.goPage(jumpPath);
        // const typeName = type[0].split('-')[0] === '1'?'databaseSource':'documentSource';
        this.props.actions.deleteTag({value,type});
    }

    goPage = (jumpPath) => {
        if (this.props.location.pathname !== jumpPath) {
            this.props.history.push(jumpPath);
        }
    }

    cleanTask = () => {
        message.info('哈哈哈，什么没有！！！')
    }

    render(){
        const {datafusion: {currentTab, treeData, treeSelectValue, treeNodeDetail, tagEditData, selectTreeNodeValue, activeTag, taskList}} = this.props;
        const dsPanelName = <span>文档库<span className='df-left-tree-title-opt' onClick={e=>{this.handleAddTreeItem(e, 'dml')}}><Icon type="plus" />添加</span></span>
        const dbPanelName = <span>数据库<span className='df-left-tree-title-opt' onClick={e=>{this.handleAddTreeItem(e, 'db')}}><Icon type="plus" />添加</span></span>
        return(
            <PageContainer
                areaLeft = {
                    <div style={{height:'100%'}}>
                        <WrapTabs
                            tabList={TAB_LIST}
                            tabOnChange={e=>{this.tabOnChange(e)}}
                            currentTab={currentTab}
                        />
                        {
                            currentTab==='dataSource'?<Collapse bordered={false} defaultActiveKey={['documentSource','databaseSource']}>
                                <Panel header={dsPanelName} key="documentSource" style={{borderBottom: 'none'}}>
                                    <div style={{maxHeight: 500, overflowY:'auto', overflowX: 'hidden'}}>
                                        <WrapTree
                                            treeData={treeData.documentSource || []}
                                            selectedKeys={treeSelectValue}
                                            onSelect={(e,data)=>{this.handleTreeOnSelect('dml', data.node.props.nodeValue, e)}}
                                        />
                                    </div>
                                </Panel>
                                <Panel header={dbPanelName} key="databaseSource" style={{borderBottom: 'none'}}>
                                    <div style={{maxHeight: 500, overflowY:'auto', overflowX: 'hidden'}}>
                                        <WrapTree
                                            treeData={treeData.databaseSource || []}
                                            selectedKeys={treeSelectValue}
                                            onSelect={(e,data)=>{this.handleTreeOnSelect('db', data.node.props.nodeValue, e)}}
                                        />
                                    </div>
                                </Panel>
                            </Collapse>:<TagList
                                style={{width: '100%'}}
                                data={TASK_LIST_MAP}
                                activeTag={activeTag}
                                onClick={e=>{this.props.actions.taskManagerOnChange({value:e})}}
                            />
                        }

                    </div>
                }
                areaRight = {
                    <div>
                        <div className='dd-mainarea-right-title'>
                            {
                                currentTab==='dataSource'?<span style={{float:'right'}}>
                                    <Button style={{marginRight:10}} type='primary' disabled={!treeSelectValue.length} onClick={(e)=>{this.handleTagEdit(e,treeSelectValue, selectTreeNodeValue)}}>编辑类型</Button>
                                    <Popconfirm title="确定删除吗？" okText="确定" cancelText="取消" placement="bottom" onConfirm={(e) => this.handleTagDelete(e,treeSelectValue, selectTreeNodeValue)}>
                                        <Button style={{marginRight:10}} type="danger" disabled={!treeSelectValue.length}>删除类型</Button>
                                    </Popconfirm>
                                </span>:<span style={{float:'right'}}>
                                    <Button style={{marginRight:10}} type="danger" onClick={this.cleanTask}>清空任务</Button>
                                </span>
                            }
                        </div>
                        {
                            currentTab==='dataSource'?<Switch>

                                <Route exact path={`${this.props.match.path}/dml/list`} render={(prop) => <Child11 {...prop} datasource={treeNodeDetail}/>} />
                                <Route exact path={`${this.props.match.path}/db/list`} render={(prop) => <Child01 {...prop} datasource={treeNodeDetail}/>} />

                                <Route path={`${this.props.match.path}/db/detail/:id`} component={Child02} />
                                <Route path={`${this.props.match.path}/dml/detail/:id`} component={Child12} />

                                <Route exact path={`${this.props.match.path}/db/add`} component={Child03} />
                                <Route exact path={`${this.props.match.path}/dml/add`} component={Child04} />

                                <Route exact path={`${this.props.match.path}/dml/edit/:id`} component={Child05} />
                                <Route exact path={`${this.props.match.path}/db/edit/:id`} component={Child08} />

                                <Route exact path={`${this.props.match.path}/none`} render={()=>null} />
                                <Redirect to={`${this.props.match.path}/db/list`} />
                            </Switch>:<TaskManager dataSource={taskList} activeTag={activeTag} />
                        }
                    </div>
                }
            />
        )
    }
}
