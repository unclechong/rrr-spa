import { Tabs, Input } from 'antd';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
import PageContainer from 'app_component/pagecontainer';

export default class TypeSystem extends React.Component {

    constructor(props) {
        super(props);

        this.tabDefaultKey = 'entity';
    }

    tabOnChange = (e) => {
        console.log(e);
    }

    handleSearchEvent = (e) => {
        console.log(e);
    }

    getTabPaneComponent(type){

    }

    render() {
        const SearchInput = (
            <Search
                placeholder="请输入关键字"
                onSearch={(e)=>{this.handleSearchEvent(e)}}
                enterButton
            />
        )
        const areaLeft = (
            <Tabs defaultActiveKey={this.tabDefaultKey} size='large' className='sm-main-area-left-tab' onChange={e=>{this.tabOnChange(e)}}>
                <TabPane tab="实体" key="entity">{SearchInput}</TabPane>
                <TabPane tab="事件" key="event">{SearchInput}</TabPane>
                <TabPane tab="关系" key="relation">{SearchInput}</TabPane>
                <TabPane tab="属性" key="prop">{SearchInput}</TabPane>
            </Tabs>
        )
        return (
            <PageContainer
                areaLeft = {areaLeft}
                areaRight = {
                    <div>222</div>
                }
            />
        )
    }
}
