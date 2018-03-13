import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

const WrapTabs = ({tabList, currentTab, tabOnChange}) => {
    return (
        <Tabs activeKey={currentTab} style={{width: '100%',textAlign: 'center'}} onChange={tabOnChange}>
            {
                tabList.map(tab=><TabPane tab={tab.name} key={tab.key} style={{width: '50%'}}></TabPane>)
            }
        </Tabs>
    )
}

export default WrapTabs
