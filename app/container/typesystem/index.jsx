import { Input, Button, Form, Modal, message, Popconfirm } from 'antd';
const { TextArea,Search } = Input;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/typesystem';

import PageContainer from 'app_component/pagecontainer';
import TagList from 'app_component/taglist';
import WrapTabs from 'app_component/tabs';
import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

import './index.css';

const tabMap = {
    entityType:'实体',
    eventType:'事件',
    relationType:'关系',
    attributionType:'属性'
}

const TAB_LIST = Object.keys(tabMap).map(i=>{
    return {
        name:tabMap[i],
        key:i
    }
})

const mapStateToProps = state => {
    return {typesystem: state.get('typesystem').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const FORM_ITEM_LIST = {
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
            type:'inputArea',
            required:false,
        },
        {
            label:'图片',
            key:'entityType_3',
            id:'photo_base64',
            type:'uploadImg',
            required:false,
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
            type:'inputArea',
            required:false,
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
            type:'inputArea',
            required:false,
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
            type:'inputArea',
            required:false,
        }
    ]
}

const bindFieldValues = (FORM_ITEM_LIST,props) => {
    let fieldObj = {};
    const currentTab = props.typesystem.currentTab;
        FORM_ITEM_LIST[currentTab].map(formItem=>{
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
        return bindFieldValues(FORM_ITEM_LIST,props)
    }
})
export default class TypeSystem extends React.Component {

    constructor(props){
        super(props)

        this.selectOptsMap = {};
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
            const {entityType, eventType} = tagList;
            this.selectOptsMap = {};
            const entityTypeChild = entityType.map(item=>{
                this.selectOptsMap[item.value] = {
                    mongoId: item.value,
                    type: 'entityType',
                    typeName: item.label
                }
                return item
            })
            const eventTypeChild = eventType.map(item=>{
                this.selectOptsMap[item.value] = {
                    mongoId: item.value,
                    type: 'eventType',
                    typeName: item.label
                }
                return item
            })

            const entityTypeOpt = [{
                label: tabMap['entityType'] + '类型',
                key: 'entityType',
                children: entityTypeChild
            }]
            const eventTypeOpt = [{
                label: tabMap['eventType'] + '类型',
                key: 'eventType',
                children: eventTypeChild
            }]
            const formList = FORM_ITEM_LIST[currentTab];
            formList.map(form=>{
                if (form.id === 'entityType_start' || form.id === 'entityType_end') {
                    form.options = entityTypeOpt;
                }else if(form.id === 'belongedType'){
                    form.options = [...entityTypeOpt, ...eventTypeOpt];
                }
            });
            return formList
        }
        return FORM_ITEM_LIST[currentTab]
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
                            entityType_end: this.selectOptsMap[entityType_end],
                            entityType_start: this.selectOptsMap[entityType_start]
                        }
                    }else if(this.props.typesystem.currentTab === 'attributionType'){
                        const {belongedType, ...rest} = values;
                        params = {...rest, belongedType:belongedType.map(i=>{
                            return this.selectOptsMap[i]
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
            }
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

    wantAddTag = () => {
        this.props.actions.wantAddTag();
    }

    //带两个参数，返回类型
    //是否是编辑， 如果是编辑状态，将参数填写去，是添加状态返回空的form
    getEditArea = (isAdd) => {
        const { getFieldDecorator } = this.props.form;
        const elseData = {isUpdate: this.props.typesystem.currentFormIsUpdate, isAdd}
        return (
            <Card
                title={`${tabMap[this.props.typesystem.currentTab]}类型${isAdd?'添加':'编辑'}`}
                body={
                    <div>
                        <FormItemFactory
                            getFieldDecorator={getFieldDecorator}
                            formList={this.getFormList()}
                            elseData={elseData}
                            onSubmit={this.formCheck}
                            onCancel={this.formCancel}
                        />
                    </div>
                }
            />
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
        const editOrAdd = !!activeTag?'编辑':'添加';
        return (
            <PageContainer
                areaLeft = {
                    <div style={{height:'100%'}}>
                        <WrapTabs
                            tabList={TAB_LIST}
                            tabOnChange={e=>{this.tabOnChange(e)}}
                            currentTab={currentTab}
                        />
                        {SearchInput}
                        <TagList
                            style={{maxHeight:'70%'}}
                            data={renderTagList}
                            onClick={this.taglistOnClick}
                            activeTag={activeTag}
                        />
                        {/* <div style={{marginTop:10,textAlign: 'center'}}>
                            <Button type="primary" icon="upload" style={{marginRight:'7%'}}>批量导出</Button>
                            <Button type="primary" icon="download">批量导入</Button>
                        </div> */}
                    </div>
                }
                areaRight = {
                    <div>
                        <div className='ts-mainarea-right-title'>
                            当前：{tabMap[currentTab]}{activeTagName?` / ${activeTagName}`:''}
                            <span style={{float:'right'}}>
                                <Button style={{marginRight:10}} type='primary' onClick={this.wantAddTag}>新增{tabMap[currentTab]}类型</Button>
                                <Popconfirm title="确定删除吗？" placement="bottom"  okText="确定" cancelText="取消" onConfirm={this.deleteCurrentType}>
                                    <Button style={{marginRight:10}} type="danger" disabled={isSearch?true:!activeTag}>删除{tabMap[currentTab]}类型</Button>
                                </Popconfirm>
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
