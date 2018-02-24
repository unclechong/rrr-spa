import { Button, Upload, Modal, message, Icon } from 'antd';
import './index.css';

const uploadLocale = {
    previewFile:"预览",
    removeFile:"删除",
    uploadError:"上传失败",
    uploading:"正在上传..."
}

export default class UploadForm extends React.Component{
    constructor(props){
        super(props);

        const value = this.props.img || undefined;
        this.state = {
            previewVisible:false,
            uploading:value?true:false,
            loading:false,
            imgURL:value || undefined
        }
        this.isOK = false;
    }

    componentWillReceiveProps(nextProps){
        if ('img' in nextProps) {
            const imgURL = nextProps.img;
            this.setState({imgURL,uploading:!!imgURL});
        }
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
                this.props.onChange(imageUrl);
                this.isOK = false;
            });
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    uploadFormHandlePreview = () => this.setState({ previewVisible: true })

    uploadFormHandleRemove = () => {
        this.setState({ imgURL: undefined,uploading:false });
        this.props.onChange(undefined);
    }

    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div style={{marginTop: 8,color: '#666'}}>上传图片</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    fileList={this.state.imgURL?[{uid: -1,url:this.state.imgURL}]:undefined}
                    locale={uploadLocale}
                    onPreview={this.uploadFormHandlePreview}
                    beforeUpload={this.uploadFormBeforeUpload}
                    onChange={this.uploadFormHandleChange}
                    onRemove={this.uploadFormHandleRemove}
                >
                    {this.state.uploading?null:uploadButton}
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="预览图片" style={{ width: '100%' }} src={this.state.imgURL} />
                </Modal>
            </div>
        )
    }
}
