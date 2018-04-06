import { Table, message, Input, Radio, Select, Divider, Button, Popover, Checkbox, TreeSelect } from 'antd';
const RadioGroup = Radio.Group;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

import knowledgegraphApi from 'app_api/knowledgegraphApi';

const EditableCellInput = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

const plainOptions = ['数值', '对象'];
const EditableCellRadio = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <RadioGroup options={plainOptions} onChange={e => onChange(e.target.value)} value={value} />
            : value
        }
    </div>
);

const EditableCellSelect = ({ editable, value, onChange, type, treeData }) => {
    return (
        <div>
            {editable
                ? type==='对象'?<TreeSelect
                        style={{ width: '100%' }}
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                      />
                :<Select value={value} style={{ width: '100%' }} onChange={e => onChange(e)}>
                      <Option value="字符串">字符串</Option>
                      <Option value="数字">数字</Option>
                      <Option value="浮点">浮点</Option>
                      <Option value="BOOL">BOOL</Option>
                      <Option value="其他">其他</Option>
                  </Select>
                : value
            }
        </div>
    )
};

const tableAddNewItem = {
    anotherName: "",
    attrList: [],
    dataType: "字符串",
    description: "",
    endNodeId: "",
    endNodeName: "",
    id: "",
    isdel: "0",
    name: "",
    propType: "数值",
    startNodeId: "",
    startNodeName: "",
    key: 'none',
    editable: true
}


export default class Child02 extends React.Component{
    constructor(props){
        super(props)

        this.columns = [{
            title: '属性名称',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'name', 'input'),
        }, {
            title: '属性别称',
            dataIndex: 'anotherName',
            key: 'anotherName',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'anotherName', 'input'),
        }, {
            title: '属性类别',
            dataIndex: 'propType',
            key: 'propType',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'propType', 'radio'),
        }, {
            title: '数据类型',
            dataIndex: 'dataType',
            key: 'dataType',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'dataType', 'select'),
        }, {
            title: '备注',
            dataIndex: 'description',
            key: 'description',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'description', 'input'),
        }, {
            title: '操作',
            dataIndex: 'operation',
                render: (text, record) => {
                const { editable } = record;
                return (
                  <div>
                    {
                      editable ?
                        <a onClick={() => this.save(record.key)}>保存</a>
                        : <a onClick={() => this.edit(record.key)}>编辑</a>
                    }
                  </div>
                );
            }
        }];

        this.recommendList = {};
        this.choiceCheckbox = [];

        this.state = {
            tableData: [],
            isEdit: false,
            visible: false,
            checkboxOpts: []
        }

    }

    componentDidMount(){
        this.cacheData = this.props.dataSource.entityTreeSlecetItem;
        const {attrList, relationList} = this.props.dataSource.entityTreeSlecetItem;
        const data1 = attrList.map(item=>{
            item.key = item.id;
            return item
        })
        const data2 = relationList.map(item=>{
            item.key = item.id;
            return item
        })
        this.setState({tableData: [...data1, ...data2]})
    }

    save = (key) => {
        const newData = [...this.state.tableData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            const {key, ...rest} = target;
            this.handleCacheData(newData);
            if (key === 'none') {
                //add
                //请求添加接口，拿回id，放进tabledata中
                this.props.onAdd({data: this.cacheData, item: rest, CB:(id)=>{
                    target.key = id;
                    target.id = id;
                    this.setState({ data: newData, isEdit: false });
                }});
            }else {
                this.setState({ data: newData, isEdit: false });
                //update
                this.props.onSave({data: this.cacheData, item: rest});
            }
        }
    }

    handleCacheData = newData => {
        let attrList = [];
        let relationList = [];
        newData.map(item=>{
            const {key, ...rest} = item;
            if (item.propType === '数值') {
                attrList.push(rest);
            }else if(item.propType === '对象'){
                relationList.push(rest);
            }
        })
        this.cacheData.attrList = attrList;
        this.cacheData.relationList = relationList;
    }

    edit = (key) => {
        if (!this.state.isEdit) {
            const newData = [...this.state.tableData];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                target.editable = true;
                this.setState({ data: newData, isEdit: true });
            }
        }else {
            message.info('请先保存上一条！');
        }
    }

    handleAddEntityProp = () => {
        this.setState({
            tableData: [...this.state.tableData, tableAddNewItem],
            isEdit: true
        });
    }

    handleQuickAddEntityProp = () => {
        let addList = [];
        this.recommendList.recommend.map(item=>{
            if (_.indexOf(this.choiceCheckbox, item.id)>-1) {
                addList.push({...item, key:item.id})
            }
        })
        this.handleCacheData([...this.state.tableData, ...addList]);
        // this.props.onSave({data: this.cacheData, item: rest});
        //  批量跟新？？？？？
        this.setState({
            tableData: [...this.state.tableData, ...addList],
            visible:false
        });
    }

    handleChange = (value, key, column) => {
        const newData = [...this.state.tableData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ data: newData });
        }

    }

    handleVisibleChange = async() => {
        this.recommendList = await knowledgegraphApi.selectRecommendRelationOrAttribute({pid:this.props.dataSource.entityTreeSlecetValue, propType:'对象'});

        const hasPropList = this.state.tableData.map(item=>item.id);
        const checkboxOpts = [{
            name: '推荐属性',
            key: 'recommend',
            child: this.recommendList.recommend.map(item=>({value:item.id,label:item.name,key:item.id,disabled:_.indexOf(hasPropList, item.id)>-1}))
            // child: this.recommendList.recommend.map(item=>({value:item.id,label:item.name,key:item.id}))
        }]
        // , {
        //     name: '其他属性',
        //     key: 'others',
        //     child: this.recommendList.others
        // }
        this.setState({
            visible: !this.state.visible,
            checkboxOpts
        })
    }

    handleCheckBoxChange = (e) => {
        this.choiceCheckbox = e;
    }

    renderColumns(text, record, column, type, ...args) {
        if(type === 'input'){
            return (
                <EditableCellInput
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
            );
        }else if(type === 'radio'){
            return (
                <EditableCellRadio
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
            );
        }else if (type === 'select') {
            console.log(record);
            return (
                <EditableCellSelect
                    editable={record.editable}
                    value={text}
                    type={record.propType}
                    tree={this.props.tree}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
            );
        }
    }

    render(){
        console.log(this.props.tree);
        return(
            <div>
                <Divider />
                <Button disabled={this.state.isEdit} type="primary" style={{marginBottom: 10, marginRight:10}} onClick={this.handleAddEntityProp}>添加</Button>
                <Popover
                    content={
                        <div>
                            {
                                this.state.checkboxOpts.map(opts=>{
                                    return <div key={opts.key}>
                                        <div style={{fontWeight: 'bold',marginBottom: 5}}>{opts.name}</div>
                                        <CheckboxGroup options={opts.child} onChange={this.handleCheckBoxChange} />
                                    </div>
                                })
                            }
                            <div style={{width:'100%', textAlign:'right', marginTop: 40}}>
                                <Button type="primary" onClick={this.handleQuickAddEntityProp}>确定添加</Button>
                            </div>
                        </div>
                    }
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                    trigger="click"
                >
                    <Button disabled={this.state.isEdit} type="primary" style={{marginBottom: 10}}>快速添加</Button>
                </Popover>
                <Table bordered dataSource={this.state.tableData} columns={this.columns} />
            </div>
        )
    }
}
