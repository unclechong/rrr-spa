import { Button, Input } from 'antd';
const { TextArea } = Input;

export default class HasBtnInputArea extends React.Component{
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
        const {placeholder,hasBtn,label} = this.props;
        return (
            <div className="clearfix">
                <TextArea
                    value={this.state.value}
                    placeholder={placeholder || `请选择${label}`}
                    style={{width:hasBtn?'70%':'100%'}}
                    onChange={this.onChange}
                />
                {hasBtn}
            </div>
        )
    }
}
