import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import App from '../container/baselayout';

// 按路由拆分代码
const MyLoadingComponent = ({ isLoading, error }) => {
    // Handle the loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }
    // Handle the error state
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    else {
        return null;
    }
};

//首页
const AsyncHomePage = Loadable({
    loader: () => import(/* webpackChunkName: 'homepage' */'../container/homepage'),
    loading: MyLoadingComponent
});
//类型系统
const AsyncTypeSystem = Loadable({
    loader: () => import(/* webpackChunkName: 'typesystem' */'../container/typesystem'),
    loading: MyLoadingComponent
});
//知识图谱
const AsyncKnowledgeGraph = Loadable({
    loader: () => import(/* webpackChunkName: 'knowledgegraph' */'../container/knowledgegraph'),
    loading: MyLoadingComponent
});
//数据融合
const AsyncDataFusion = Loadable({
    loader: () => import(/* webpackChunkName: 'datafusion' */'../container/datafusion'),
    loading: MyLoadingComponent
});
//人工纠错
const AsyncArtificialCorrection = Loadable({
    loader: () => import(/* webpackChunkName: 'artificialcorrection' */'../container/artificialcorrection'),
    loading: MyLoadingComponent
});
//用户
const AsyncUser = Loadable({
    loader: () => import(/* webpackChunkName: 'user' */'../container/user'),
    loading: MyLoadingComponent
});
//404 NotFound
const AsyncNotFound = Loadable({
    loader: () => import(/* webpackChunkName: 'error_404' */'../component/error/404'),
    loading: MyLoadingComponent
});

const WrapApp = (props)=>{
    return (
        <App {...props}>
            <Switch>
                <Route path={`${props.match.path}`} exact component={AsyncHomePage} />
                <Route path={`${props.match.path}/type`} exact component={AsyncTypeSystem} />
                <Route path={`${props.match.path}/graph`} exact component={AsyncKnowledgeGraph} />
                <Route path={`${props.match.path}/data`} component={AsyncDataFusion} />
                <Route path={`${props.match.path}/repair`} exact component={AsyncArtificialCorrection} />
                <Route path={`${props.match.path}/user`} exact component={AsyncUser} />
                <Redirect to="/error/404" />
            </Switch>
        </App>
    )
}

// 路由配置
export default class RouteMap extends React.Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/error/404" component={AsyncNotFound} />
                    <Route path="/supermind" component={WrapApp} />
                    <Redirect to="/supermind" />
                </Switch>
            </HashRouter>
        );

    }
}
