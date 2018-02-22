import { Input, Button, Form, Upload, Modal, Select,TreeSelect, message,Icon } from 'antd';
import './index.css';

export default class UploadForm extends React.Component{
    constructor(props){
        super(props);

        const value = this.props.value || {};
        this.state = {
            uploading:false,
            loading:false,
            imgURL:value.imgURL || null
        }
        this.isOK = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id === 'img') {
            //如果饭base64 就直接放进去
            this.isOK = true;
            this.uploadFormHandleChange({file:nextProps.fileList[0]})
        }
        console.log(nextProps);
        // if ('value' in nextProps) {
        //     console.log(nextProps.value)
        //     const value = nextProps.value;
        //     console.log(value);
        //     this.setState(value);
        // }
    }

    getBase64 = (img, callback) => {
        const fr = new FileReader();
        fr.readAsDataURL(img);  // 将文件读取为Data URL
        fr.onload = function(e) {
            const result = e.target.result;
            callback(result);
        }
    }

    uploadFormBeforeUpload = (file) => {
        const isJPG = file.type.indexOf('image') > -1;
        if (!isJPG) {
            message.error('文件类型不能匹配！');
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片过大，不能超过2MB！');
            return false
        }
        this.isOK = true;
        return false
    }

    uploadFormHandleChange = info => {
        if (this.isOK) {
            this.setState({loading:true});
            this.getBase64(info.file, imageUrl => {
                this.setState({
                    uploading:true,
                    loading:false,
                    imgURL:imageUrl
                })
                console.log(this.state);
                // this.props.onChange(Object.assign({}, this.state.value, {img:imageUrl}));
                this.isOK = false;
            });
        }
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
        console.log(111);
    }

    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div style={{marginTop: 8,color: '#666'}}>上传图片</div>
            </div>
        );
        return (
            <Upload
                listType="picture-card"
                className="avatar-uploader"
                // onPreview={this.uploadFormHandlePreview}

                name="logo"
                beforeUpload={this.uploadFormBeforeUpload}
                onChange={this.uploadFormHandleChange}
            >
                {this.state.uploading ? <img style={{width:88,height:88}} src={this.state.imgURL} alt="" /> : uploadButton}
            </Upload>
        )
    }
}
