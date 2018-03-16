import sendPost from './commonApi';

export default class datafusionApi {

    static async getTreeData(params={}){
        const result = await sendPost('./test/tree.json', 'get', true, params);

        const documentSource = result.documentSource.map((child, index)=>({title: child.sourceName, key: '0-'+index, value: child.mongoId}));
        const databaseSource = result.databaseSource.map((child, index)=>({title: child.sourceName, key: '1-'+index, value: child.mongoId}));

        // const documentSource = result.documentSource.map((child, index)=>({label: child.sourceName, key: child.mongoId, value: child.mongoId}));
        // const databaseSource = result.databaseSource.map((child, index)=>({label: child.sourceName, key: child.mongoId, value: child.mongoId}));

        return {documentSource, databaseSource}
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


}
