import { Tabs, Input, Button,Form, Upload,Modal } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea,Search } = Input;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/typesystem';

import PageContainer from 'app_component/pagecontainer';
import TagList from 'app_component/taglist';
import FormItemFactory from 'app_component/FormItemFactory';
import './index.css';

const tabMap = {
    entity:'实体',
    event:'事件',
    relation:'关系',
    prop:'属性'
}

const mapStateToProps = state => {
    return {typesystem: state.get('typesystem').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const formListMap = {
    entity:[
        {
            label:'名称',
            id:'entity|username',
            key:'1',
            type:'input'
        },
        {
            label:'描述',
            key:'2',
            id:'entity|desc',
            type:'inputArea'
        },
        {
            label:'图片',
            key:'3',
            id:'entity|img444',
            type:'uploadImg'
        }
    ],
    event:[
        {
            label:'名称',
            id:'username',
            key:'4',
            type:'input'
        },
        {
            label:'描述',
            key:'14',
            id:'desc',
            type:'inputArea'
        },
    ],
    relation:[
        {
            label:'名称',
            key:'5',
            id:'username',
            type:'input'
        },
        {
            label:'描述',
            key:'6',
            id:'desc',
            type:'inputArea'
        },
        {
            label:'对象1',
            id:'obj1',
            key:'7',
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
            key:'8',
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
            id:'user2name',
            key:'91',
            type:'input'
        },
        {
            label:'对象1',
            key:'102',
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
            key:'8911',
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
            key:'111',
            id:'desc',
            type:'inputArea'
        }
    ]
}

const bindFileldValues = (formListMap,props) => {
    let obj = {};
    for (let key in formListMap) {
        formListMap[key].map(formItem=>{
            const index = formItem.id.split('|')[1];
            obj[formItem.id] = Form.createFormField({
                value: props.typesystem.formData[key][index]
            })
        })
    }
    return obj
}

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return bindFileldValues(formListMap,props)
    }
})
export default class TypeSystem extends React.Component {

    // constructor(props){
    //     super(props);
    //
    // }

    componentDidMount(){
        //获取页面左侧类型列表
        this.props.actions.gettargetlist();
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
    }

    handleSearchEvent = (keyword) => {
        // if (keyword === '') {
        //     this.props.actions.cleanSearch();
        //     return
        // }
        //the same keyword return
        if (keyword === this.props.typesystem.prevKeyword) return
        //搜索
        this.props.actions.search({keyword,type:this.props.typesystem.currentTab});
    }

    taglistOnClick = (activeTag,e) => {
        //选择列表tag
        if (activeTag === this.props.typesystem.activeTag) {
            this.props.actions.resetTaglist();
        }else {
            this.props.actions.changeActiveTag(e);
        }
    }

    // addCurrentType = (isEdit) => {
    //     if (!isEdit) {
    //         this.props.actions.showAddArea(true);
    //     }else {
    //         this.props.actions.showEditArea(data=>{
    //             this.props.form.setFieldsValue(data);
    //         });
    //     }
    // }

    deleteCurrentType = () => {
        this.props.actions.deleteActiveTag();
    }

    //form提交
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

    checkModalHandleCancel = () => {
        this.props.actions.triggerCheckModal(false);
    }

    checkModalHandleOk = () => {
        this.props.actions.needCloseEditArea();
    }

    //清空form
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

    render() {
        const {typesystem:{activeTag,activeTagName,isSearch,searchResultList,searchKeyword,
            currentTab,showAddArea,tagList,checkModal}} = this.props;
        const renderTagList = isSearch?searchResultList:tagList[currentTab] || [];
        const SearchInput = (
            <Search
                placeholder="请输入关键字"
                value={searchKeyword}
                onChange={(e)=>{this.props.actions.changeSearchKeyword(e.target.value)}}
                onPressEnter={(e)=>{this.handleSearchEvent(e)}}
                onSearch={(e)=>{this.handleSearchEvent(e)}}
                enterButton
                style={{marginBottom:10}}
            />
        )
        const areaLeft = (
            <Tabs activeKey={currentTab} className='ts-main-area-left-tab' onChange={e=>{this.tabOnChange(e)}}>
                <TabPane tab="实体" key="entity"></TabPane>
                <TabPane tab="事件" key="event"></TabPane>
                <TabPane tab="关系" key="relation"></TabPane>
                <TabPane tab="属性" key="prop"></TabPane>
            </Tabs>
        )
        const editOrAdd = !!activeTag?'编辑':'添加';
        // <div className='ts-mainarea-right-logo'>supermind</div>
        return (
            <PageContainer
                areaLeft = {
                    <div style={{height:'100%'}}>
                        {areaLeft}
                        {SearchInput}
                        <TagList
                            style={{maxHeight:'70%'}}
                            data={renderTagList}
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
                                <Button style={{marginRight:10,color:'red'}} onClick={this.deleteCurrentType} disabled={!activeTag}>删除{tabMap[currentTab]}类型</Button>
                            </span>
                        </div>
                        {this.getEditArea()}
                        <Modal
                            visible={checkModal}
                            okText='确定放弃'
                            cancelText={`继续${editOrAdd}`}
                            onCancel={this.checkModalHandleCancel}
                            onOk={this.checkModalHandleOk}
                        >
                            {`确定放弃当前的${editOrAdd}？`}
                        </Modal>
                    </div>
                }
            />
        )
    }
}
