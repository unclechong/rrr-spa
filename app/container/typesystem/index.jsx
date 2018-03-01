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
            id:'entityType_start',
            key:'relationType_3',
            type:'select',
            selectGroup: true,
            options:[]
        },
        {
            label:'对象2',
            key:'relationType_4',
            id:'entityType_end',
            type:'select',
            selectGroup: true,
            options:[]
        }
    ],
    attributionType:[
        {
            label:'名称',
            id:'typeName',
            key:'attributionType_1',
            type:'input'
        },
        {
            label:'值',
            key:'attributionType_2',
            id:'attrValueType',
            type:'select',
            options:[
                {
                    label:'整数值',
                    value:'int'
                },
                {
                    label:'浮点值',
                    value:'float'
                },
                {
                    label:'布尔值',
                    value:'bool'
                },
                {
                    label:'日期时间',
                    value:'datetime'
                },
                {
                    label:'日期',
                    value:'date'
                },
                {
                    label:'时间',
                    value:'time'
                },
                {
                    label:'字符串',
                    value:'string'
                },
                {
                    label:'范围型',
                    value:'range'
                },
                {
                    label:'Map型',
                    value:'map'
                }
            ]
        },
        {
            label:'所属对象',
            key:'attributionType_3',
            id:'belongedType',
            type:'select',
            mode:'multiple',
            selectGroup: true,
            options:[]
        },
        {
            label:'备注',
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

        // this.currentTagIndex = 0;
    }

    componentDidMount(){
        //获取页面左侧类型列表
        this.props.actions.gettargetlist();
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
        // this.currentTagIndex = 0;
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
        // this.currentTagIndex = 0;
    }

    taglistOnClick = (activeTag,e,index) => {
        //选择列表tag
        // if (activeTag === this.props.typesystem.activeTag) {
        //     this.props.actions.cancelSelectedTag();
        // }else {
            this.props.actions.editTag(e, index);
        // }
    }

    getFormList = () => {
        const {tagList, currentTab} = this.props.typesystem;
        if (currentTab === 'relationType' || currentTab === 'attributionType') {
            const options = [{
                label: tabMap['entityType'],
                key: 'entityType',
                children: tagList['entityType'].map(item=>({...item, value: item.value+'|'+item.label}))
            },{
                label: tabMap['attributionType'],
                key: 'attributionType',
                children: tagList['attributionType'].map(item=>({...item, value: item.value+'|'+item.label}))
            }];
            const formList = formListMap[currentTab];
            formList.map(form=>{
                if (form.id === 'entityType_start' || form.id === 'entityType_end' || form.id === 'belongedType') {
                    form.options = options;
                }
            });
            console.log(formList);
            return formList
        }else return formListMap[currentTab]
    }

    deleteCurrentType = () => {
        this.props.actions.deleteActiveTag(()=>{
            message.success('删除成功');
        });
    }

    //form提交
    formCheck = () => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    let params = values;
                    if (this.props.typesystem.currentTab === 'relationType') {
                        const {entityType_end, entityType_start, ...rest} = values;
                        params = {...rest,
                            entityType_end: {
                                mongoId: entityType_end.split('|')[0],
                                typeName: entityType_end.split('|')[1]},
                            entityType_start: {
                                mongoId: entityType_start.split('|')[0],
                                typeName: entityType_start.split('|')[1]
                            }
                        }
                    }else if(this.props.typesystem.currentTab === 'attributionType'){
                        const {belongedType, ...rest} = values;
                        params = {...rest, belongedType:belongedType.map(i=>{
                            const [_f, _b] = i.split('|');
                            return {
                                mongoId: _f,
                                typeName: _b
                            }
                        })};
                    }
                    const isAdd = !this.props.typesystem.activeTag;
                    if (isAdd) {
                        this.props.actions.addTag(params, ()=>{
                            message.success('添加成功');
                        });
                    }else {
                        this.props.actions.updateTag(params, ()=>{
                            message.success('编辑成功');
                        });
                    }
                }
            },
        );
    }

    checkModalHandleCancel = () => {
        this.props.actions.needCloseEditArea(false);
    }

    checkModalHandleOk = () => {
        this.props.actions.needCloseEditArea(true);
    }

    //清空form
    formCancel = () => {
        this.props.actions.cleanFormValues();
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
                        formList={this.getFormList()}
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
                <TabPane tab="关系" key="relationType"></TabPane>
                <TabPane tab="事件" key="eventType"></TabPane>
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
