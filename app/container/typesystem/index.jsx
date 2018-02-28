import { Tabs, Input, Button, Form, Upload, Modal, message } from 'antd';
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
    entityType:'实体',
    eventType:'事件',
    relationType:'关系',
    attributionType:'属性'
}

const mapStateToProps = state => {
    return {typesystem: state.get('typesystem').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const formListMap = {
    entityType:[
        {
            label:'名称',
            id:'typeName',
            key:'entityType_1',
            type:'input'
        },
        {
            label:'描述',
            key:'entityType_2',
            id:'typeDescription',
            type:'inputArea'
        },
        {
            label:'图片',
            key:'entityType_3',
            id:'photo_base64',
            type:'uploadImg'
        }
    ],
    eventType:[
        {
            label:'名称',
            id:'typeName',
            key:'eventType_1',
            type:'input'
        },
        {
            label:'描述',
            key:'eventType_2',
            id:'typeDescription',
            type:'inputArea'
        }
    ],
    relationType:[
        {
            label:'名称',
            key:'relationType_1',
            id:'typeName',
            type:'input'
        },
        {
            label:'描述',
            key:'relationType_2',
            id:'typeDescription',
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
    attributionType:[
        {
            label:'名称',
            id:'typeName',
            key:'attributionType_1',
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
            key:'attributionType_4',
            id:'typeDescription',
            type:'inputArea'
        }
    ]
}

const bindFieldValues = (formListMap,props) => {
    let fieldObj = {};
    const currentTab = props.typesystem.currentTab;
        formListMap[currentTab].map(formItem=>{
            fieldObj[formItem.id] = Form.createFormField({
                ...props.typesystem.formData[formItem.id]
            })
        })
    return fieldObj
}

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
    onFieldsChange(props, changedFields) {
        props.actions.mergeFieldsValues(changedFields);
    },
    mapPropsToFields(props) {
        return bindFieldValues(formListMap,props)
    }
})
export default class TypeSystem extends React.Component {

    constructor(props){
        super(props)

        this.currentTagIndex = 0;
    }

    componentDidMount(){
        //获取页面左侧类型列表
        this.props.actions.gettargetlist();
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
        this.currentTagIndex = 0;
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
        this.currentTagIndex = 0;
    }

    taglistOnClick = (activeTag,e,index) => {
        //选择列表tag
        // if (activeTag === this.props.typesystem.activeTag) {
        //     this.props.actions.cancelSelectedTag();
        // }else {
            this.currentTagIndex = index;
            this.props.actions.editTag(e);
        // }
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
        this.props.actions.deleteActiveTag(this.currentTagIndex,()=>{
            message.success('删除成功');
        });
    }

    //form提交
    formCheck = () => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    this.props.actions.addTag(values, ()=>{
                        message.success('添加成功');
                    });
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
        this.props.actions.cleanFormValues();
        // this.props.form.setFieldsValue({img:''})
    }

    //带两个参数，返回类型
    //是否是编辑， 如果是编辑状态，将参数填写去，是添加状态返回空的form
    getEditArea = (isAdd) => {
        const { getFieldDecorator } = this.props.form;
        const elseData = {isUpdate: this.props.typesystem.currentFormIsUpdate, isAdd}
        return (
            <div className='ts-mainarea-right-body'>
                <div className='ts-mainarea-right-body-title'>{tabMap[this.props.typesystem.currentTab]}类型{isAdd?'添加':'编辑'}</div>
                <div>
                    <FormItemFactory
                        getFieldDecorator={getFieldDecorator}
                        formList={formListMap[this.props.typesystem.currentTab]}
                        elseData={elseData}
                        onSubmit={this.formCheck}
                        onCancel={this.formCancel}
                    />
                </div>
            </div>
        )
    }

    render() {
        const {typesystem:{activeTag,activeTagName,isSearch,searchResultList,searchKeyword,
            currentTab,currentFormIsUpdate,tagList,checkModal}} = this.props;
        console.log('in render');
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
                <TabPane tab="实体" key="entityType"></TabPane>
                <TabPane tab="事件" key="eventType"></TabPane>
                <TabPane tab="关系" key="relationType"></TabPane>
                <TabPane tab="属性" key="attributionType"></TabPane>
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
                                <Button style={{marginRight:10,color:'red'}} onClick={this.deleteCurrentType} disabled={isSearch?true:!activeTag}>删除{tabMap[currentTab]}类型</Button>
                            </span>
                        </div>
                        {this.getEditArea(!activeTag)}
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
