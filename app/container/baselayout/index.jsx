import {Layout, Menu, Breadcrumb} from 'antd';
const {Header, Content, Footer} = Layout;
import {Link} from 'react-router-dom';

import './index.css'

export default class BaseLayout extends React.PureComponent{
    constructor(props){
        super(props)

        this.prveMenuKey = null;

        this.handleMenuChange = this.handleMenuChange.bind(this);
    }

    handleMenuChange(arg){
        if(arg.key !== this.prveMenuKey){
            this.props.history.push(`/${arg.key.split('_').join('/')}`)
        }
    }

    render(){
        const {children,location: { pathname },match} = this.props;
        const pathArr = pathname.split('/');
        //兼容有子页面路由
        const splitPathArr = pathArr.length > 2?pathArr.slice(1,3):pathArr.slice(1);
        const currentMenuKey = splitPathArr.join('_');
        this.prveMenuKey = currentMenuKey;
        return (
            <Layout style={{
                    height: '100%'
                }}>
                <Header>
                    <div className="baselayout-logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        onClick={this.handleMenuChange}
                        selectedKeys={[currentMenuKey]}
                        style={{
                            lineHeight: '64px',
                            float: 'right'
                        }}
                    >
                        <Menu.Item key="supermind">
                            首页
                        </Menu.Item>
                        <Menu.Item key="supermind_type">
                            类型系统
                        </Menu.Item>
                        <Menu.Item key="supermind_graph">
                            知识图谱
                        </Menu.Item>
                        <Menu.Item key="supermind_data">
                            数据融合
                        </Menu.Item>
                        <Menu.Item key="supermind_repair">
                            人工纠错
                        </Menu.Item>
                        <Menu.Item key="supermind_user">
                            用户
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content
                    style={{
                        padding: '0 24px',
                        background:'#f7f7f7'
                    }}
                >
                    <div>
                        {children}
                    </div>
                </Content>
            </Layout>
        )
    }
}
