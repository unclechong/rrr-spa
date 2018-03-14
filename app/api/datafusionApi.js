import sendPost from './commonApi';

export default class datafusionApi {

    static async getTreeData(params={}){
        const result = await sendPost('./test/tree.json', 'get', true, params);

        const documentSource = result.documentSource.map((child, index)=>({title: child.sourceName, key: index, id: child.mongoId}));
        const databaseSource = result.databaseSource.map((child, index)=>({title: child.sourceName, key: index, id: child.mongoId}));

        // const documentSource = result.documentSource.map((child, index)=>({label: child.sourceName, key: child.mongoId, value: child.mongoId}));
        // const databaseSource = result.databaseSource.map((child, index)=>({label: child.sourceName, key: child.mongoId, value: child.mongoId}));

        return {documentSource, databaseSource}
    };

}
