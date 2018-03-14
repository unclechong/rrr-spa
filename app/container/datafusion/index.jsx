import { Collapse, Icon, Button } from 'antd';
const Panel = Collapse.Panel;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';

import PageContainer from 'app_component/pagecontainer';
import WrapTabs from 'app_component/tabs';
import WrapTree from 'app_component/tree';

import Child01 from './child_table.jsx';
import Child02 from './child_db_detail.jsx';

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
        this.props.actions.getTreeData();
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
    }

    handleTreeOnSelect = (e,x) => {
        console.log(x);
    }

    handleAddTreeItem = (e) => {
        e.stopPropagation();
        console.log(111);
    }

    render(){
        const {datafusion: {currentTab, treeData}} = this.props;

        const dsPanelName = <span>文档库<span className='df-left-tree-title-opt' onClick={this.handleAddTreeItem}><Icon type="plus" />添加</span></span>
        const dbPanelName = <span>数据库<span className='df-left-tree-title-opt' onClick={this.handleAddTreeItem}><Icon type="plus" />添加</span></span>
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
                                <WrapTree treeData={treeData.documentSource} onSelect={this.handleTreeOnSelect}/>
                            </Panel>
                            <Panel header={dbPanelName} key="databaseSource" style={{borderBottom: 'none'}}>
                                <WrapTree treeData={treeData.databaseSource || []} onSelect={this.handleTreeOnSelect}/>
                            </Panel>
                        </Collapse>
                    </div>
                }
                areaRight = {
                    <div>
                        <div className='dd-mainarea-right-title'>
                            <span style={{float:'right'}}>
                                <Button style={{marginRight:10}} type='primary'>编辑分类</Button>
                                <Button style={{marginRight:10,color:'red'}} >删除类型</Button>
                            </span>
                        </div>
                        <Child02 />
                    </div>
                }
            />
        )
    }
}
