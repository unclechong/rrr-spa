import { Col, Row, Select, Button, Icon, Upload, message } from 'antd';
const Option = Select.Option;
const Dragger = Upload.Dragger;

import Card from 'app_component/card';
import {getServerUrl} from 'app_api/commonApi';
import knowledgegraphApi from 'app_api/knowledgegraphApi';

export default class Child extends React.Component{

    constructor(props){
        super(props)

        this.selectLabel = '实例';
        this.url = undefined;

        this.state = {
            fileList: []
        }
    }

    async componentDidMount(){
        const {url} = await getServerUrl();
        this.url = url;
    }


    handelExport = async() => {
        const {entityTreeSlecetValue} = this.props.info;

        window.location.href = this.url + '/knowledgeGraph/exportEntityInstance?config_id=14&pid=' + entityTreeSlecetValue;
    }

    downTemplate = () => {
        const {entityTreeSlecetValue} = this.props.info;

        window.location.href = this.url + '/knowledgeGraph/exportEntityTemplate?config_id=14&pid=' + entityTreeSlecetValue;
    }

    onFileChange = params => {
        this.file = params.file;
        this.setState(({ fileList }) => ({
            fileList: [...fileList, params.file],
        }));



    }

    handleUpload = async() => {
        let formData = new FormData();
        this.state.fileList.forEach((file) => {
            formData.append('file', file);
        });
        const {entityTreeSlecetValue} = this.props.info;

        // const data = await axios.get(
        //     'http://192.168.1.253:8088/supermind/api/knowledgeGraph/importEntityInstance?config_id=14&pid='+ entityTreeSlecetValue,
        //     {params:{file:formData}}, {
        //       headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //       }
        // });
        // knowledgegraphApi.importEntityInstance({pid:entityTreeSlecetValue,formData}).then(res=>{
        //
        // })
    }

    render(){
        return (
            <Card
                title='导入导出'
                body={
                    <Row gutter={16} >
                        <Col span={12} offset={4}>
                            <div>
                                <Select defaultValue="instance" style={{ width: 300 }}>
                                    <Option value="instance">实例</Option>
                                    <Option value="concept" disabled>概念</Option>
                                    <Option value="prop" disabled>属性</Option>
                                </Select>
                                <br />
                                <Button style={{marginTop:20}} type="primary" onClick={this.handelExport}>{`${this.selectLabel}导出`}</Button>
                                <br />
                                <Button style={{margin:'20px 0',}} type="primary" onClick={this.downTemplate}>{`下载${this.selectLabel}模板`}</Button>
                                <br />
                                <div style={{
                                    width: '60%'
                                }}>
                                    <Dragger
                                        customRequest={this.onFileChange}
                                        fileList={this.state.fileList}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">{`上传${this.selectLabel}`}</p>
                                        <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
                                    </Dragger>
                                </div>
                                <Button style={{marginTop:20}} type="primary" onClick={this.handleUpload}>确认上传</Button>
                            </div>
                        </Col>
                    </Row>

                }
            />
        )
    }
}
