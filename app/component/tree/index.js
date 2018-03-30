import { Tree, Icon, Popover } from 'antd';
const TreeNode = Tree.TreeNode;
import './index.css';

// const handelMore = (e, fn) => {
//     e.stopPropagation();
//     console.log(11111111111111111);
// }

const renderTreeNodesTitle = (title, hasTitleBtn ,titleBtn) => {
    if (hasTitleBtn) {
        return (
            <span>
                <span className='wt-tree-title-left'>{title}</span>
                <span className='wt-tree-title-right'>{titleBtn}</span>
            </span>
        )
    }
    return title
}

const entityTreeOnLoadData = (treeNode, onLoadAction, treeData) => {
    return new Promise((resolve) => {
        if (treeNode.props.children) {
            resolve();
            return;
        }
        onLoadAction({treeNode,newTreeData:treeData});
        resolve();
    })
}

const renderTreeNodes = (data, titleBtn) => {
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNode {...item} key={item.key} title={renderTreeNodesTitle(item.title, item.hasTitleBtn, titleBtn)} nodeValue={item.value} dataRef={item} className='wt-wrap-class'>
                    {renderTreeNodes(item.children, titleBtn)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.key} title={renderTreeNodesTitle(item.title, item.hasTitleBtn, titleBtn)} nodeValue={item.value} dataRef={item} className='wt-wrap-class' />;
    });
}

const WrapTree = ({treeData, onSelect, selectedKeys, titleBtn=null, onLoadAction, multiple=false}) => {
    return (
        <Tree
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            loadData={onLoadAction?(treeNode)=>entityTreeOnLoadData(treeNode, onLoadAction, treeData):null}
            multiple={multiple}
        >
            {renderTreeNodes(treeData, titleBtn)}
        </Tree>
    )
}

export default WrapTree
