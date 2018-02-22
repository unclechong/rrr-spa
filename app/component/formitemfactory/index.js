import { Input, Button, Form, Upload, Modal, Select,TreeSelect, message,Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const SHOW_ALL = TreeSelect.SHOW_ALL;
import UploadForm from './uploadform';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};
const formTailLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12, offset: 4 },
};

const normFile = ({file}) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);  // 将文件读取为Data URL

    fr.onload = function(e) {
        return e.target.result;
    }
    return '111'
}

const returnFormItem = (getFieldDecorator,itemData) => {
    const {label,id,type} = itemData;
    if (type === 'inputArea') {
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    // initialValue:'1',
                    rules: [{
                        required: true,
                        message: itemData.message || `请输入${label}`,
                    }],
                })(
                    <TextArea placeholder={itemData.placeholder || `请输入${label}`} autosize={{ minRows: 2, maxRows: 6 }} />
                )}
            </FormItem>
        )
    }else if (type === 'input') {
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    // initialValue:'1',
                    rules: [{
                        required: true,
                        message: itemData.message || `请输入${label}`,
                    }],
                })(
                    <Input placeholder={itemData.placeholder || `请输入${label}`} />
                )}
            </FormItem>
        )
    }else if (type === 'uploadImg') {
        // <Icon type={this.state.loading ? 'loading' : 'plus'} />
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div style={{marginTop: 8,color: '#666'}} >Upload</div>
            </div>
        );
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                })(
                    <UploadForm />
                )}
            </FormItem>
        )
    }else if (type === 'select') {
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    rules: [{
                        required: true,
                        message: itemData.message || `请选择${label}`,
                    }]
                })(
                    <Select placeholder={itemData.placeholder || `请选择${label}`} style={{width:'100%'}}>
                        {
                            itemData.options.map(option=><Option value={option.value} key={option.value}>{option.label}</Option>)
                        }
                    </Select>
                )}
            </FormItem>
        )
    }else if (type === 'multiple') {
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    rules: [{
                        required: true,
                        message: itemData.message || `请选择${label}`,
                        type: 'array'
                    }]
                })(
                    <Select mode="multiple" allowClear placeholder={itemData.placeholder || `请选择${label}`} style={{width:'100%'}}>
                        {
                            itemData.options.map(option=><Option value={option.value} key={option.value}>{option.label}</Option>)
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
            showCheckedStrategy: SHOW_ALL,
            // treeCheckable:true
        }
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    rules: [{
                        required: true,
                        message: itemData.message || `请选择${label}`,
                        type: 'array'
                    }]
                })(
                    <TreeSelect {...props} />
                )}
            </FormItem>
        )
    }
}

const FormItemFactory = ({getFieldDecorator,formList,onSubmit,onCancel}) => {
    return (
        <div>
            {
                formList.map(item=>returnFormItem(getFieldDecorator,item))
            }
            <FormItem {...formTailLayout}>
                <Button type="primary" icon="check" style={{marginRight:'7%'}} onClick={onSubmit}>保存</Button>
                <Button icon="close" onClick={onCancel}>清空</Button>
            </FormItem>
        </div>
    )
}

export default FormItemFactory
