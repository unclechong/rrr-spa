import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';

import PageContainer from 'app_component/pagecontainer';
import WrapTabs from 'app_component/tabs';
// import FormItemFactory from 'app_component/formitemfactory';
import './index.css';

const TAB_LIST = [
    {
        name: '数据源',
        key: 'dataSource'
    }, {
        name: '任务管理',
        key: 'taskManage'
    }
]

const mapStateToProps = state => {
    return {datafusion: state.get('datafusion').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class DataFusion extends React.Component{

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
    }

    render(){
        const {datafusion:{currentTab}} = this.props;
        return(
            <PageContainer
                areaLeft = {
                    <div style={{height:'100%'}}>
                        <WrapTabs
                            tabList={TAB_LIST}
                            tabOnChange={e=>{this.tabOnChange(e)}}
                            currentTab={currentTab}
                        />
                        2222
                    </div>
                }
                areaRight = {
                    <div>
                        22222
                    </div>
                }
            />
        )
    }
}
