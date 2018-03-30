import { Icon, Button, Form, message } from 'antd';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/knowledgegraph';

import PageContainer from 'app_component/pagecontainer';
import WrapTabs from 'app_component/tabs';
import TagList from 'app_component/taglist';
import WrapTree from 'app_component/tree';
import WrapCard from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';

import './index.css';

const TAB_LIST = [
    {
        name: '实体',
        key: 'entity'
    }, {
        name: '事件',
        key: 'event'
    }
];

const FORM_ITEM_LIST = [
    {
        label:'名称',
        key:'name',
        id:'name',
        type:'input'
    },
    {
        label:'父概念',
        id:'pid',
        key:'pid',
        type:'select',
        options:[]
    },
    {
        label:'描述',
        key:'description',
        id:'description',
        type:'inputArea',
        required:false,
    },
    {
        label:'图片',
        key:'photoBase64',
        id:'photoBase64',
        type:'uploadImg',
        required:false,
    }
]

const mapStateToProps = state => {
    return {knowledgegraph: state.get('knowledgegraph').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const bindFieldValues = (FORM_ITEM_LIST,props) => {
    let fieldObj = {};
    FORM_ITEM_LIST.map(formItem=>{
        fieldObj[formItem.id] = Form.createFormField({
            ...props.knowledgegraph.formData[formItem.id]
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
export default class Knowledgegraph extends React.Component{
    constructor(props){
        super(props)

    }

    componentDidMount(){
        this.props.actions.initKnowledgegraph()
    }


    getFormList = () => {
        const {currentFormIsAdd, entityTreeSelectInfo:{entityTreeSlecetPValue, entityTreeSlecetPLabel, entityTreeSlecetLabel, entityTreeSlecetValue}} = this.props.knowledgegraph;
        if (currentFormIsAdd) {
            FORM_ITEM_LIST[1].options = [{
                label: entityTreeSlecetLabel,
                key: entityTreeSlecetValue,
                value: entityTreeSlecetValue
            }]
        }else {
            if (entityTreeSlecetPValue === '0') {
                FORM_ITEM_LIST[1].options = [{
                    label: '暂无',
                    key: '0',
                    value: '0'
                }]
            }else if(entityTreeSlecetPValue){
                FORM_ITEM_LIST[1].options = [{
                    label: entityTreeSlecetPLabel,
                    key: entityTreeSlecetPValue,
                    value: entityTreeSlecetPValue
                }]
            }
        }

        return FORM_ITEM_LIST
    }

    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab(e);
    }

    entityTreeOnSelect = (selectKey, e) => {
        if (selectKey.length) {
            this.props.actions.changeEntityTreeSelect({selectKey, selectValue: e.node.props.nodeValue, selectIdPath: e.node.props.idPath})
        }
    }

    formCheck = (isAdd) => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    if (isAdd) {
                        this.props.actions.addEntityBaseInfo({values, CB: ()=>{
                            message.success('添加成功')
                        }})
                    }else {
                        this.props.actions.updateEntityBaseInfo({values, CB: ()=>{
                            message.success('编辑成功')
                        }})
                    }
                }
            }
        );
    }


    formCancel = () => {
        this.props.actions.resetFieldsValues();
    }

    handleAddEntity = (e) => {
        e.stopPropagation();
        this.props.actions.enterAddEntity();
    }

    handleDeleteEntity = (e) => {
        e.stopPropagation();
        this.props.actions.deleteAddEntity({CB: ()=>{
            message.success('删除成功')
        }});
    }


    render(){
        const {knowledgegraph: {currentTab, entityTreeData, entityTreeSelectInfo, currentFormIsUpdate, currentFormIsAdd}} = this.props;
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
                            currentTab === 'entity'?<WrapTree
                                treeData={entityTreeData}
                                titleBtn={
                                    <span>
                                        <Icon type="plus" style={{color: '#3963b2',marginRight: 5}} onClick={this.handleAddEntity} />
                                        <Icon type="close" style={{color: '#3963b2'}} onClick={this.handleDeleteEntity} />
                                    </span>
                                }
                                onLoadAction={this.props.actions.onLoadEntityTreeData}
                                selectedKeys={entityTreeSelectInfo.entityTreeSlecetKey}
                                onSelect={this.entityTreeOnSelect}
                            />:null
                        }

                    </div>
                }
                areaRight = {
                    <div>
                        <div className='kg-mainarea-right-title'>
                            {
                                <span style={{float:'right'}}>
                                    <Button style={{marginRight:10}} type='primary'>编辑分类</Button>
                                    <Button style={{marginRight:10}} type="danger">删除类型</Button>
                                </span>
                            }
                        </div>
                        <WrapCard
                            title={`概念${currentFormIsAdd?'添加':'编辑'}`}
                            body={
                                <div>
                                    <FormItemFactory
                                        getFieldDecorator={this.props.form.getFieldDecorator}
                                        formList={this.getFormList()}
                                        onSubmit={()=>{this.formCheck(currentFormIsAdd)}}
                                        onCancel={this.formCancel}
                                        elseData={{isUpdate: currentFormIsUpdate, isAdd: currentFormIsAdd}}
                                    />
                                </div>
                            }
                        />
                    </div>
                }
            />
        )
    }
}
