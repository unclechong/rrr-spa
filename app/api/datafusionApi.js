import sendPost from './commonApi';

export default class datafusionApi {

    static async getTreeData(params={}){
        // const result = await sendPost('./test/tree.json', 'get', true, params);
        const result = {
            "databaseSource": [
                {
                    "mongoId": "5aa64cb2848cd544ed491a4a",
                    "sourceName": "数据库1"
                }
            ],
            "documentSource": [
                {
                    "mongoId": "5aa64c7e848cd544ed491a48",
                    "sourceName": "文档类型1"
                },
                {
                    "mongoId": "5aa64c97848cd544ed491a49",
                    "sourceName": "文档类型2"
                }
            ]
        }

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
