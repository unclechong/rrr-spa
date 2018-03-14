import { Tree, Icon } from 'antd';
const TreeNode = Tree.TreeNode;
import './index.css';

const renderTreeNodesTitle = (title) => {
    return (
        <span>
            <span className='wt-tree-title-left'>{title}</span>
            <span className='wt-tree-title-right'><Icon type="plus-square" /></span>
        </span>
    )

}

const renderTreeNodes = (data) => {
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={renderTreeNodesTitle(item.title)} key={item.key} dataRef={item} className='wt-wrap-class'>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} dataRef={item} className='wt-wrap-class' />;
    });
}

const WrapTree = ({treeData, onSelect}) => {
    // loadData={this.onLoadData
    return (
        <Tree onSelect={onSelect}>
            {renderTreeNodes(treeData)}
        </Tree>
    )
}

export default WrapTree
