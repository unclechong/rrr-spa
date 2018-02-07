import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers/index.js';
import RouteMap from './router';

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <RouteMap />
    </Provider>,
	document.getElementById("container")
)










// console.log(111222333);
// Array.from(new Set('1','3'))
// ['1','2','3','4'].includes('1')
