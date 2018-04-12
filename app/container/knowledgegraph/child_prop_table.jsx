import { Table, message, Input, Radio, Select, Divider, Button, Popover, Checkbox, TreeSelect, Popconfirm } from 'antd';
const RadioGroup = Radio.Group;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const TreeNode = TreeSelect.TreeNode;

import knowledgegraphApi from 'app_api/knowledgegraphApi';


const SELECT_OPTIONS = [
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

const EditableCellSelect = ({ editable, value, onChange, type, tree }) => {
    const optValue = type==='对象' ? value : SELECT_OPTIONS.filter(item=>item.value === value)[0].label;
    return (
        <div>
            {editable
                ? type==='对象'?tree
                :<Select value={value} style={{ width: '100%' }} onChange={e => onChange(e)}>
                    {
                        SELECT_OPTIONS.map(item=>{
                            return <Option value={item.value} key={item.value}>{item.label}</Option>
                        })
                    }
                  </Select>
                : optValue || ''
            }
        </div>
    )
};

const tableAddNewItem = {
    anotherName: "",
    attrList: [],
    dataType: "string",
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
                          editable ? <span>
                              <a onClick={() => this.save(record.key)} style={{marginRight:10}}>保存</a>
                              <a onClick={() => this.cancel(record.key)}>取消</a>
                          </span>
                            : <span>
                                <a onClick={() => this.edit(record.key)} style={{marginRight:10}}>编辑</a>
                                <Popconfirm title="确定删除吗？" okText="确定" cancelText="取消" onConfirm={() => this.delete(record)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                        }
                    </div>
                );
            }
        }];

        this.recommendList = {};
        this.choiceCheckbox = {};

        this.editItemOldData = {};

        this.state = {
            tableData: [],
            isEdit: false,
            visible: false,
            checkboxOpts: [],
            treeSelectValue: []
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
        let target = newData.filter(item => key === item.key)[0];
        if (target.name === '') {
            message.info('请填写属性名称')
            return
        }
        if (target.propType === '对象') {
            const {value: endNodeId, label: endNodeName} = this.state.treeSelectValue;
            target.endNodeName = endNodeName;
            target.endNodeId = endNodeId;
        }
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
                    this.setState({ tableData: newData, isEdit: false });
                }});
            }else {
                this.setState({ tableData: newData, isEdit: false });
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

    cancel = (key) => {
        const newData = [...this.state.tableData];
        if (key === 'none') {
            newData.pop();
            this.setState({ tableData: newData, isEdit: false });
        }else {
            delete this.editItemOldData.editable;
            const returnData = newData.map((item,index) => {
                return key === item.key?this.editItemOldData:item
            })
            this.setState({ tableData: returnData, isEdit: false });
        }
    }

    edit = (key) => {
        if (!this.state.isEdit) {
            const newData = [...this.state.tableData];
            const target = newData.filter(item => key === item.key)[0];
            const {dataType, endNodeId, endNodeName} = target;
            this.editItemOldData = {...target};
            if (target) {
                target.editable = true;
                this.setState({
                    tableData: newData,
                    isEdit: true,
                    treeSelectValue: target.propType==='对象'?endNodeId?{value: endNodeId, label: endNodeName}:[]: []
                });
            }
        }else {
            message.info('请先保存上一条！');
        }
    }

    delete = (record) => {
        if (!this.state.isEdit) {
            const listName = record.propType === '数值'?'attrList':'relationList';
            let deleteIndex;
            this.cacheData[listName].map((item,index)=>{
                if (item.key === record.key) {
                    deleteIndex = index;
                }
            })
            this.cacheData[listName].splice(deleteIndex, 1);
            this.props.onSave({data: this.cacheData});

            const newData = [...this.state.tableData];
            let tableIndex;
            newData.map((item,index)=>{
                if (item.key === record.key) {
                    tableIndex = index;
                }
            })
            newData.splice(tableIndex, 1);
            this.setState({ tableData: newData});
        }else {
            message.info('请先保存上一条！');
        }
    }

    handleAddEntityProp = () => {
        this.setState({
            tableData: [...this.state.tableData, tableAddNewItem],
            isEdit: true,
            treeSelectValue: []
        });
    }

    handleQuickAddEntityProp = () => {
        let addList = [];
        this.recommendList.recommend.map(item=>{
            if (_.indexOf(this.choiceCheckbox['recommend'], item.id)>-1) {
                addList.push({...item, key:item.id})
            }
        })
        this.recommendList.others.map(item=>{
            if (_.indexOf(this.choiceCheckbox['others'], item.id)>-1) {
                addList.push({...item, key:item.id})
            }
        })
        this.handleCacheData([...this.state.tableData, ...addList]);
        this.props.onSave({data: this.cacheData});
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
            this.setState({ tableData: newData });
        }

    }

    handleVisibleChange = async() => {
        this.recommendList = await knowledgegraphApi.selectRecommendRelationOrAttribute({pid:this.props.dataSource.entityTreeSlecetPValue});

        const hasPropList = this.state.tableData.map(item=>item.id);
        const checkboxOpts = [{
            name: '推荐属性',
            key: 'recommend',
            child: this.recommendList.recommend.map(item=>({value:item.id,label:item.name,key:item.id,disabled:_.indexOf(hasPropList, item.id)>-1}))
        },{
            name: '全部属性',
            key: 'others',
            child: this.recommendList.others.map(item=>({value:item.id,label:item.name,key:item.id,disabled:_.indexOf(hasPropList, item.id)>-1}))
        }]

        this.setState({
            visible: !this.state.visible,
            checkboxOpts
        })
    }

    handleCheckBoxChange = (e, type) => {
        this.choiceCheckbox[type] = e;
    }

    treeSelectOnChange = (e) => {
        this.setState({
            treeSelectValue: e
        })
    }

    treeSelectLoadData = (e) => {
        return new Promise((resolve) => {
            if (e.props.children) {
                resolve();
                return;
            }
            this.props.onLoadAction({treeNode: e, newTreeData: this.props.treeData});
            resolve();
        })
    }


    renderTreeNodes = (data, titleBtn) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode {...item} key={item.key} title={item.title} nodeValue={item.value} dataRef={item} className='wt-wrap-class'>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.key} title={item.title} nodeValue={item.value} dataRef={item} className='wt-wrap-class' />;
        });
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
            return (
                <EditableCellSelect
                    editable={record.editable}
                    value={record.propType==='对象'?record.endNodeName:text}
                    type={record.propType}
                    tree={<TreeSelect
                        onLoadAction={this.props.onLoadAction}
                        style={{ width: '100%' }}
                        value={this.state.treeSelectValue}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        labelInValue
                        onChange={this.treeSelectOnChange}
                        loadData={this.treeSelectLoadData}
                    >
                        {this.renderTreeNodes(this.props.treeData)}
                    </TreeSelect>}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
            );
        }
    }

    render(){
        return(
            <div>
                <Divider />
                <Button disabled={this.state.isEdit} type="primary" style={{marginBottom: 10, marginRight:10}} onClick={this.handleAddEntityProp}>添加</Button>
                <Popover
                    content={
                        <div style={{maxWidth: 500}}>
                            {
                                this.state.checkboxOpts.map(opts=>{
                                    return <div key={opts.key}>{
                                        opts.child.length?<span>
                                            <div style={{fontWeight: 'bold',marginBottom: 5}}>{opts.name}</div>
                                            <CheckboxGroup options={opts.child} onChange={e=>{this.handleCheckBoxChange(e, opts.key)}} />
                                        </span>:null
                                    }
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
