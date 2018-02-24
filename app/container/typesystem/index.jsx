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

import typesystemApi from 'app_api/typesystemApi';

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

const formListMap = {
    entity:[
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
            id:'img444',
            type:'uploadImg'
        }
    ],
    event:[
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
    ],
    relation:[
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
            label:'对象1',
            id:'obj1',
            type:'select',
            options:[
                {
                    label:'opt1',
                    value:'o1'
                },
                {
                    label:'opt2',
                    value:'o2'
                },
                {
                    label:'opt3',
                    value:'o3'
                }
            ]
        },
        {
            label:'对象2',
            id:'obj2',
            type:'select',
            options:[
                {
                    label:'opt1',
                    value:'o1'
                },
                {
                    label:'opt2',
                    value:'o2'
                },
                {
                    label:'opt3',
                    value:'o3'
                }
            ]
        },
    ],
    prop:[
        {
            label:'名称',
            id:'username',
            type:'input'
        },
        {
            label:'对象1',
            id:'obj1',
            type:'select',
            options:[
                {
                    label:'opt1',
                    value:'o1'
                },
                {
                    label:'opt2',
                    value:'o2'
                },
                {
                    label:'opt3',
                    value:'o3'
                }
            ]
        },
        {
            label:'单选',
            id:'obj2',
            type:'treeselect',
            treeData:[{
              label: 'Node1',
              value: '0-0',
              key: '0-0',
              disabled:true,
              // isLeaf:true,
              children: [{
                label: 'Child Node1',
                value: '0-0-1',
                key: '0-0-1',
              }, {
                label: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2',
              }],
            }, {
            disabled:true,
              label: 'Node2',
              value: '0-1',
              key: '0-1',
            }]
        },
        {
            label:'描述',
            id:'desc',
            type:'inputArea'
        }
    ]
}

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
export default class TypeSystem extends React.Component {

    constructor(props) {
        super(props);

        this.tabDefaultKey = 'entity';
    }

    componentDidMount(){
        // this.props.actions.changeActiveTag();
        // typesystemApi.gettargetlist().then(res=>{
        //     console.log(res.data);
        // });
        setTimeout(()=>{
            this.props.actions.gettargetlist();
        },1000)
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

    formCheck = () => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    // console.log( file.url || file.thumbUrl);
                    // var fr = new FileReader();
                    console.log(values);
                    // fr.readAsDataURL(values.img[0]);  // 将文件读取为Data URL
                    //
                    // fr.onload = function(e) {
                    //     var result = e.target.result;
                    //     console.log(result);
                    // }
                    // console.info(values);
                }
            },
        );
    }

    formCancel = () => {
        this.props.form.resetFields();
        // this.props.form.setFieldsValue({img:''})
    }

    //带两个参数，返回类型
    //是否是编辑， 如果是编辑状态，将参数填写去，是添加状态返回空的form
    getEditArea = () => {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='ts-mainarea-right-body'>
                <div className='ts-mainarea-right-body-title'>{tabMap[this.props.typesystem.currentTab]}类型编辑</div>
                <div>
                    <FormItemFactory
                        getFieldDecorator={getFieldDecorator}
                        formList={formListMap[this.props.typesystem.currentTab]}
                        onSubmit={this.formCheck}
                        onCancel={this.formCancel}
                    />
                </div>
            </div>
        )
    }

    addCurrentType = () => {
        this.props.actions.showAddArea(true);
    }

    render() {
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
                        {showAddArea?this.getEditArea():null}
                    </div>
                }
            />
        )
    }
}
