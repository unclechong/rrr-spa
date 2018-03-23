import sendPost from './commonApi';

export default class datafusionApi {

    static async getTreeData(params={}){
        const result = await sendPost('/dataSource/getSourceList', 'post', false, params);

        const documentSource = result.documentSource.map((child, index)=>({title: child.sourceName, key: '0-'+index, value: child.mongoId}));
        const databaseSource = result.databaseSource.map((child, index)=>({title: child.sourceName, key: '1-'+index, value: child.mongoId}));

        return {documentSource, databaseSource}
    };

    static async getTreeNodeDetail(params={}){
        const result = await sendPost('/dataSource/getOne', 'post', false, params);
        result.dataList.map((item, index)=>{
            item.key = item.dataId;
            item.no = index+1;
        })
        return result.dataList
    };

    static async getDbItemDetail(params={}){
        const result = await sendPost('/dataSource/getOneDetail', 'post', false, params);
        result.knowledge.entity.map((item, index)=>{
            item.key = index+'entity';
            item.no = index+1;
        })
        result.knowledge.event.map((item, index)=>{
            item.key = index+'event';
            item.no = index+1;
        })
        return result
    };

    static async getDbItemEditInfo(params={}){
        const result = await sendPost('/dataSource/getOneInfo', 'post', false, params);
        return result
    };



    //db add child API
    static async getMappingDataInStep1(params={}){
        // const result = await sendPost('./test/tree.json', 'get', true, params);
        const treeData = [
            { title: 'Expand to load', key: '0' },
            { title: 'Expand to load', key: '1' , children:[{ title: 'Expand to load', key: '1-0' }]},
            { title: 'Tree Node', key: '2', isLeaf: true },
        ]

        return treeData
    };

    // get step3 select options data
    static async getStep3SelectOptionsData(params={}){
        // const result = await sendPost('./test/tree.json', 'get', true, params);
        const optionsData = [
            { key: '0', value: '0', label: '高管' },
            { key: '1', value: '1', label: '生产' },
            { key: '2', value: '2', label: '下游' }
        ]

        return optionsData
    };


}
