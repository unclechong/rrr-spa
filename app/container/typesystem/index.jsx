import { Tabs, Input, Button,Form, Upload,Modal } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea,Search } = Input;
import PageContainer from 'app_component/pagecontainer';
import TagList from 'app_component/taglist';
import FormItemFactory from 'app_component/FormItemFactory';

import './index.css';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/typesystem';
const taglist = [
    {
        key:'1',
        value:'1',
        label:'1133333333333333333333333333333333333333333333333331'
    },
    {
        key:'2',
        value:'2',
        label:'222'
    },
    {
        key:'3',
        value:'3',
        label:'333'
    },
    {
        key:'4',
        value:'4',
        label:'444'
    },
    {
        key:'5',
        value:'5',
        label:'555'
    },
    {
        key:'6',
        value:'6',
        label:'666'
    }
]
const mapStateToProps = state => {
    return {typesystem: state.get('typesystem').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const tabMap = {
    entity:'实体',
    event:'事件',
    relation:'关系',
    prop:'属性'
}


const formList = [
    {
        label:'名称',
        id:'username',
        type:'input'
    },
    {
        label:'描述',
        id:'desc',
        type:'inputArea'
    },
    {
        label:'图片',
        id:'img',
        type:'uploadImg'
    }
]

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
export default class TypeSystem extends React.Component {

    constructor(props) {
        super(props);

        this.tabDefaultKey = 'entity';
    }

    componentDidMount(){
        // this.props.actions.changeActiveTag();
        this.props.actions.changeTab(this.tabDefaultKey);
    }

    tabOnChange = (e) => {
        this.props.actions.changeTab(e);
    }

    handleSearchEvent = (e) => {
        console.log(e);
    }

    getTabPaneComponent(type){

    }

    taglistOnClick = (activeTag,e) => {
        this.props.actions.changeActiveTag(e);
    }

    check = () => {
  this.props.form.validateFields(
    (err,values) => {
      if (!err) {
        console.info(values);
      }
    },
  );
}
handleChange = (e) => {
  this.setState({
    checkNick: e.target.checked,
  }, () => {
    this.props.form.validateFields(['nickname'], { force: true });
  });
}

handlePreview = (file) => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
}


    //带两个参数，返回类型
    //是否是编辑， 如果是编辑状态，将参数填写去，是添加状态返回空的form
    getAddArea = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
        };
        const formTailLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12, offset: 4 },
        };
        return (
        <div className='ts-mainarea-right-body'>
            <div className='ts-mainarea-right-body-title'>{tabMap[this.props.typesystem.currentTab]}类型编辑</div>
            <div>
                <FormItemFactory getFieldDecorator={getFieldDecorator} formList={formList} onSubmit={this.check} />
            </div>
        </div>
    )
}

    addCurrentType = () => {
        this.props.actions.showAddArea(true);
    }

    render() {
        console.log('render');
        const {typesystem:{activeTag,activeTagName,currentTab,showAddArea}} = this.props;
        const SearchInput = (
            <Search
                placeholder="请输入关键字"
                onSearch={(e)=>{this.handleSearchEvent(e)}}
                enterButton
                style={{marginBottom:10}}
            />
        )
        const areaLeft = (
            <Tabs defaultActiveKey={this.tabDefaultKey} className='ts-main-area-left-tab' onChange={e=>{this.tabOnChange(e)}}>
                <TabPane tab="实体" key="entity"></TabPane>
                <TabPane tab="事件" key="event"></TabPane>
                <TabPane tab="关系" key="relation"></TabPane>
                <TabPane tab="属性" key="prop"></TabPane>
            </Tabs>
        )
        return (
            <PageContainer
                areaLeft = {
                    <div style={{height:'100%'}}>
                        {areaLeft}
                        {SearchInput}
                        <TagList
                            style={{maxHeight:'70%'}}
                            data={taglist}
                            onClick={this.taglistOnClick}
                            activeTag={activeTag}
                        />
                        <div style={{marginTop:10,textAlign: 'center'}}>
                            <Button type="primary" icon="upload" style={{marginRight:'7%'}}>批量导出</Button>
                            <Button type="primary" icon="download">批量导入</Button>
                        </div>
                    </div>
                }
                areaRight = {
                    <div>
                        <div className='ts-mainarea-right-title'>
                            当前：{tabMap[currentTab]}{activeTagName?` / ${activeTagName}`:''}
                            <span style={{float:'right'}}>
                                <Button type="primary" style={{marginRight:10}} onClick={this.addCurrentType}>{!!activeTag?'编辑':'添加'}{tabMap[currentTab]}类型</Button>
                                <Button style={{marginRight:10,color:'red'}} disabled={!activeTag}>删除{tabMap[currentTab]}类型</Button>
                            </span>
                        </div>
                        {showAddArea?this.getAddArea():null}
                    </div>
                }
            />
        )
    }
}
