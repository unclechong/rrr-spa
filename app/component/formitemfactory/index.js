import { Input, Button, Form, Upload, Modal } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};
const formTailLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12, offset: 4 },
};

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
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
        return (
            <FormItem {...formItemLayout} label={label} key={id}>
                {getFieldDecorator(id, {
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                })(
                     // <div className="clearfix">
                    <Upload
                        name="logo"
                        listType="picture"
                        beforeUpload={(file)=>{
                        // console.log( file.url || file.thumbUrl);
                        // var fr = new FileReader();
                        // fr.readAsDataURL(file);  // 将文件读取为Data URL
                        //
                        // fr.onload = function(e) {
                        //     var result = e.target.result;
                        //     console.log(result);
                        // }

                        return false}
                        }
                    >
                        <Button type="dashed">选择图片</Button>
                    </Upload>
                )}
            </FormItem>
        )
    }
}

const FormItemFactory = ({getFieldDecorator,formList,onSubmit}) => {
    return (
        <div>
            {
                formList.map(item=>returnFormItem(getFieldDecorator,item))
            }
            <FormItem {...formTailLayout}>
                <Button type="primary" icon="check" style={{marginRight:'7%'}} onClick={onSubmit}>保存</Button>
                <Button icon="close">清空</Button>
            </FormItem>
        </div>
    )
}

export default FormItemFactory
