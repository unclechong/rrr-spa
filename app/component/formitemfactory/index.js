import { Input, Button, Form, Select,TreeSelect } from 'antd';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
// const SHOW_ALL = TreeSelect.SHOW_ALL;
import UploadForm from './uploadform';
import HasBtnSelect from './hasBtnSelect';
import HasBtnInputArea from './hasBtnInputArea';

import './index.css';

const defaultFormItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};
const formTailLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12, offset: 4 },
};

const checkFieldNull = (rule, value, callback) => {
    if (value === '' || value === undefined || value.length === 0) {
        callback(rule.message);
        return;
    }else {
        callback();
    }
}

const returnFormItem = (getFieldDecorator, itemData, layout) => {
    const {label, id, type, key, required, hasBtn} = itemData;
    const formItemLayout = layout || defaultFormItemLayout;
    if (type === 'inputArea') {
        return (
            <FormItem {...formItemLayout} label={label} key={key} hasFeedback={hasBtn?false:required}>
                {getFieldDecorator(id, {
                    // initialValue:'1',
                    rules: [{
                        validator: required?checkFieldNull:null ,
                        message: itemData.message || `请输入${label}`,
                    }],
                })(
                    <TextArea placeholder={itemData.placeholder || `请输入${label}`} autosize={{ minRows: 2, maxRows: 6 }} style={{width: hasBtn?'70%':'100%'}}/>
                )}
            </FormItem>
        )
    }else if (type === 'hasBtnInputArea') {
        return (
            <FormItem {...formItemLayout} label={label} key={key}>
                {getFieldDecorator(id, {
                    rules: [{
                        validator: checkFieldNull ,
                        message: itemData.message || `请选择${label}`,
                    }]
                })(
                    <HasBtnInputArea {...itemData} />
                )}
            </FormItem>
        )
    }else if (type === 'input') {
        return (
            <FormItem {...formItemLayout} label={label} key={key} hasFeedback>
                {getFieldDecorator(id, {
                    // initialValue:'1',
                    rules: [{
                        validator: checkFieldNull ,
                        message: itemData.message || `请输入${label}`,
                    }],
                })(
                    <Input placeholder={itemData.placeholder || `请输入${label}`} />
                )}
            </FormItem>
        )
    }else if (type === 'uploadImg') {
        return (
            <FormItem {...formItemLayout} label={label} key={key}>
                {getFieldDecorator(id, {
                    valuePropName:'img',
                    // initialValue:'',
                    rules: [{
                        validator: itemData.required?checkFieldNull:null,
                        message: itemData.message || `请上传图片`,
                    }],
                })(
                    <UploadForm />
                )}
            </FormItem>
        )
    }else if (type === 'select') {
        const {message, mode, placeholder, selectGroup, options} = itemData;
        return (
            <FormItem {...formItemLayout} label={label} key={key} hasFeedback>
                {getFieldDecorator(id, {
                    rules: [{
                        validator: checkFieldNull ,
                        message: message || `请选择${label}`,
                    }]
                })(
                    <Select mode={mode || null} placeholder={placeholder || `请选择${label}`} style={{width:'100%'}}>
                        {
                            selectGroup?options.map(group=>{
                                return <OptGroup label={group.label} key={group.key}>
                                    {group.children.map(option=>{
                                        return <Option value={option.value} key={option.value}>{option.label}</Option>
                                    })}
                                </OptGroup>
                            }):options.map(option=><Option value={option.value} key={option.value}>{option.label}</Option>)
                        }
                    </Select>
                )}
            </FormItem>
        )
    }else if (type === 'treeselect') {
        const props = {
            showSearch:true,
            style:{width:'100%'},
            dropdownStyle:{ maxHeight: 400, overflow: 'auto' },
            placeholder:itemData.placeholder || `请选择${label}`,
            allowClear:true,
            multiple:true,
            treeData:itemData.treeData,
            treeDefaultExpandAll:itemData.treeDefaultExpandAll || true,
            treeNodeFilterProp:'label',
            // treeCheckStrictly:true
            // showCheckedStrategy: SHOW_ALL,
            // treeCheckable:true
        }
        return (
            <FormItem {...formItemLayout} label={label} key={key}>
                {getFieldDecorator(id, {
                    rules: [{
                        validator: checkFieldNull ,
                        message: itemData.message || `请选择${label}`,
                        type: 'array'
                    }]
                })(
                    <TreeSelect {...props} />
                )}
            </FormItem>
        )
    }else if (type === 'button') {
        return (
            <FormItem {...formItemLayout} label={label} key={key}>
                {getFieldDecorator(id, {
                    rules: [{}]
                })(
                    <Button type="dashed" onClick={itemData.onClick}>{itemData.buttonName}</Button>
                )}
            </FormItem>
        )
    }else if (type === 'hasBtnSelect') {
        return (
            <FormItem {...formItemLayout} label={label} key={key}>
                {getFieldDecorator(id, {
                    rules: [{
                        validator: checkFieldNull ,
                        message: itemData.message || `请选择${label}`,
                    }]
                })(
                    <HasBtnSelect {...itemData} />
                )}
            </FormItem>
        )
    }
}

const FormItemFactory = ({getFieldDecorator, formList, onSubmit, onCancel, elseData, noBtn=false, formItemLayout}) => {
    const {isAdd, isUpdate} = elseData || {};
    return (
        <div>
            {
                formList.map(item=>returnFormItem(getFieldDecorator, item, formItemLayout))
            }
            {noBtn?null:<FormItem {...formTailLayout}>
                <Button type="primary" icon="check" style={{marginRight:'7%'}} onClick={onSubmit} disabled={isAdd?false:!isUpdate}>{isAdd?'添加':'保存'}</Button>
                <Button icon="close" onClick={onCancel}>清空</Button>
            </FormItem>}
        </div>
    )
}

export default FormItemFactory
