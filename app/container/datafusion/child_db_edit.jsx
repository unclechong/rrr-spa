import { Button, Form } from 'antd';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/datafusion';
import QueueAnim from 'rc-queue-anim';
import immutable from 'immutable';

import Card from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';
//
import Child01 from './child_db_edit_1.jsx';
import Child02 from './child_db_edit_2.jsx';
import Child03 from './child_db_edit_3.jsx';


const mapStateToProps = state => {
    return {dbEdit: state.get('datafusionChildDbEdit').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
@connect(mapStateToProps, mapDispatchToProps)
export default class Child08 extends React.Component{

    componentDidMount(){
        this.props.actions.getCurrentTagData({id:this.props.match.params.id,type:'db'})
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     console.log(nextProps.dbEdit, this.props.dbEdit);
    //     if (nextProps.dbEdit.needRender != this.props.dbEdit.needRender) {
    //         console.log(222);
    //         return true
    //     }
    //     return false
    // }

    formData(data){
        const {attribution, entity, event, relation, relationAttr} = data;
        const entityMap = {};
        entity.map(item=>{
            entityMap[item.id] = item.typeName;
        })
        return {
            entity: entity.map(item=>item.typeName),
            attribution: [].concat.apply([],Object.keys(attribution).map(key=>{
                return attribution[key].map(item=>`${entityMap[key]}/${item.typeName} - ${item.fields[0]}`)
            })),
            relation: relation.map(item=>`${entityMap[item.start]} - ${item.typeName} - ${entityMap[item.end]}`),
            relationAttr
        }
    }

    render(){
        const {tagEditData,editStep} = this.props.dbEdit;
        let childData = null;
        if (editStep === 3) {
            childData = {...tagEditData.dataProcessingTaskInfo, tableData: this.formData(tagEditData.dataProcessingTaskInfo.d2rPattern)};
        }
        return(
            <QueueAnim animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                ]}
            >
                {
                    (()=>{
                        if (editStep === 1) return <Child01 dataSource={tagEditData} onClickNext={(obj)=>{this.props.actions.editTagNext({type:'db',...obj})}} />
                        else if(editStep === 2) return <Child02 dataSource={tagEditData.dataBusTaskInfo} />
                        else if(editStep === 3) return <Child03 dataSource={childData} />
                    })()
                }
            </QueueAnim>
        )
    }
}
