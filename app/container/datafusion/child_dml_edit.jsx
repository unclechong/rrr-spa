import { Button, Form } from 'antd';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';
import QueueAnim from 'rc-queue-anim';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';
//
import Child01 from './child_dml_edit_1.jsx';
import Child02 from './child_dml_edit_2.jsx';
import Child03 from './child_dml_edit_3.jsx';

const mapStateToProps = state => {
    return {dmlEdit: state.get('datafusionChildDmlEdit').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
@connect(mapStateToProps, mapDispatchToProps)
export default class Child08 extends React.Component{

    componentDidMount(){
        this.props.actions.getCurrentTagData({id:this.props.match.params.id,type:'dml'})
    }

    render(){
        const {tagEditData,editStep} = this.props.dmlEdit;
        return(
            <QueueAnim animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                ]}
            >
                {
                    (()=>{
                        if (editStep === 1) return <Child01 dataSource={tagEditData} onClickNext={(obj)=>{this.props.actions.editTagNext({type:'dml',...obj})}} />
                        else if(editStep === 2) return <Child02 dataSource={tagEditData.dataBusTaskInfo} />
                        else if(editStep === 3) return <Child03 dataSource={tagEditData.dataProcessingTaskInfo} />
                    })()
                }
            </QueueAnim>
        )
    }
}
