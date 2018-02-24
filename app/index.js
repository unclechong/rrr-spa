import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import RouteMap from './router';
import configureStore from './store';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <RouteMap />
    </Provider>,
	document.getElementById("container")
)
