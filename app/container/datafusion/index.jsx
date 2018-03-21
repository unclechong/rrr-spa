import { Collapse, Icon, Button } from 'antd';
const Panel = Collapse.Panel;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';
import { Route, Switch, Redirect } from 'react-router-dom';

import PageContainer from 'app_component/pagecontainer';
import WrapTabs from 'app_component/tabs';
import WrapTree from 'app_component/tree';

import Child01 from './child_table.jsx';
import Child02 from './child_db_detail.jsx';

import Child04 from './child_dml_add.jsx';
import Child05 from './child_dml_edit_1.jsx';
import Child06 from './child_dml_edit_2.jsx';
import Child07 from './child_dml_edit_3.jsx';

import Child03 from './child_db_add.jsx';
import Child08 from './child_db_edit_1.jsx';
import Child09 from './child_db_edit_2.jsx';
import Child10 from './child_db_edit_3.jsx';

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

const mapStateToProps = state => {
    return {datafusion: state.get('datafusion').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class DataFusion extends React.Component{

    componentDidMount(){
        this.props.actions.initDataFusion();
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
    }


    // 类型, id, key
    handleTreeOnSelect = (type, value, index) => {
        //不能进行反选
        if (index.length) {
            this.props.actions.changeTreeSelect(index);
        }
    }

    handleAddTreeItem = (e, type) => {
        e.stopPropagation();
        const jumpPath = `${this.props.match.path+'/'+type}/add`;
        if (this.props.location.pathname !== jumpPath) {
            this.props.history.push(jumpPath);
        }
    }

    handleTagEdit = (e,type) => {
        e.stopPropagation();
        const _type = type[0].substring(0,1)==='1'?'db':'dml';
        const jumpPath = `${this.props.match.path+'/'+_type}/edit/baseinfo`;
        if (this.props.location.pathname !== jumpPath) {
            this.props.history.push(jumpPath);
        }
    }

    render(){
        const {datafusion: {currentTab, treeData, treeSelectValue}} = this.props;
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
                        <Collapse bordered={false} defaultActiveKey={['databaseSource']}>
                            <Panel header={dsPanelName} key="documentSource" style={{borderBottom: 'none'}}>
                                <WrapTree
                                    treeData={treeData.documentSource}
                                    selectedKeys={treeSelectValue}
                                    onSelect={(e,data)=>{this.handleTreeOnSelect('documentSource', data.node.props.value, e)}}
                                />
                            </Panel>
                            <Panel header={dbPanelName} key="databaseSource" style={{borderBottom: 'none'}}>
                                <WrapTree
                                    treeData={treeData.databaseSource || []}
                                    selectedKeys={treeSelectValue}
                                    onSelect={(e,data)=>{this.handleTreeOnSelect('databaseSource', data.node.props.value, e)}}
                                />
                            </Panel>
                        </Collapse>
                    </div>
                }
                areaRight = {
                    <div>
                        <div className='dd-mainarea-right-title'>
                            <span style={{float:'right'}}>
                                <Button style={{marginRight:10}} type='primary' disabled={!treeSelectValue.length} onClick={(e)=>{this.handleTagEdit(e,treeSelectValue)}}>编辑分类</Button>
                                <Button style={{marginRight:10}} type="danger" disabled={!treeSelectValue.length}>删除类型</Button>
                            </span>
                        </div>
                        <Switch>
                            <Route exact path={`${this.props.match.path}/dml/list`} component={Child01} />
                            <Route exact path={`${this.props.match.path}/db/list`} component={Child01} />
                            <Route exact path={`${this.props.match.path}/db/detail`} component={Child02} />
                            <Route exact path={`${this.props.match.path}/db/add`} component={Child03} />
                            <Route exact path={`${this.props.match.path}/dml/add`} component={Child04} />

                            <Route exact path={`${this.props.match.path}/dml/edit/baseinfo`} component={Child05} />
                            <Route exact path={`${this.props.match.path}/dml/edit/datasource`} component={Child06} />
                            <Route exact path={`${this.props.match.path}/dml/edit/modalconf`} component={Child07} />

                            <Route exact path={`${this.props.match.path}/db/edit/baseinfo`} component={Child08} />
                            <Route exact path={`${this.props.match.path}/db/edit/sourceinfo`} component={Child09} />
                            <Route exact path={`${this.props.match.path}/db/edit/mappingconf`} component={Child10} />

                            <Redirect to={`${this.props.match.path}/db/list`} />
                        </Switch>

                    </div>
                }
            />
        )
    }
}
