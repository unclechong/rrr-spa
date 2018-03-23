import { Button, Select } from 'antd';
const { Option, OptGroup } = Select;

export default class HasBtnSelect extends React.Component{
    constructor(props){
        super(props);

        const value = this.props.value || undefined;
        this.state = {
            value: value
        }
    }

    componentWillReceiveProps(nextProps){
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({value});
        }
    }

    onChange = (value) => {
        this.props.onChange(value);
    }

    render(){
        const {mode,placeholder,hasBtn,label,selectGroup,options} = this.props;
        return (
            <div className="clearfix">
                <Select
                    mode={mode || null}
                    value={this.state.value}
                    placeholder={placeholder || `请选择${label}`}
                    style={{width:hasBtn?'70%':'100%'}}
                    onChange={this.onChange}
                >
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
                {hasBtn}
            </div>
        )
    }
}
