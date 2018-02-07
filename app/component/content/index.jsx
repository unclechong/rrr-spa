import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/action'

const mapStateToProps = state => {
    return {showinfo: state.get('reduce').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

// const mapDispatchToProps = dispatch => ({
//     haveChange: () => dispatch({type:'HAVE_CHANGE'}),
//     addTodo: () => dispatch({type:'ADD_TODO'})
// });

// JS装饰器
@connect(mapStateToProps, mapDispatchToProps)
export default class Content extends React.Component {

    constructor(props) {
        super(props);

        //binding event
        this.handleAddItem = this.handleAddItem.bind(this);
        // this.handleAddItem = this.handleAddItem(item) { return (e) => {}; }
    }

    handleAddItem(a) {
        console.log(a);
        this.props.actions.addTodo()
    }

    render() {
        let {showinfo, actions} = this.props;
        return (<div>
            {showinfo.change}
            <div onClick={actions.haveChange}>+</div>
            <div>
                <button onClick={() => {
                        this.handleAddItem(showinfo.listTotal)
                    }}>
                    Add
                </button>
                <div>
                    {
                        showinfo.isAdd
                            ? '正在添加...'
                            : `已添加${showinfo.listTotal}条`
                    }
                </div>
            </div>
            <div>
                <ul>
                    {showinfo.addList.map((item, key) => (<li key={key}>{item}</li>))}
                </ul>
            </div>
        </div>)
    }
}

// Connected Component
// const App = connect(mapStateToProps,mapDispatchToProps)(Content)

// export default App
