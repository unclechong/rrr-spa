import { Tabs, Input } from 'antd';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
import PageContainer from 'app_component/pagecontainer';
import TagList from 'app_component/taglist';
import './index.css';

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

    taglistOnClick = () => {
        console.log(1111);
    }

    render() {
        const SearchInput = (
            <Search
                placeholder="请输入关键字"
                onSearch={(e)=>{this.handleSearchEvent(e)}}
                enterButton
                style={{marginBottom:10}}
            />
        )
        const areaLeft = (
            <Tabs defaultActiveKey={this.tabDefaultKey} className='sm-main-area-left-tab' onChange={e=>{this.tabOnChange(e)}}>
                <TabPane tab="实体" key="entity">{SearchInput}<TagList onClick={this.taglistOnClick} activeTag='2' /></TabPane>
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
