import sendPost from './commonApi';

export default class datafusionApi {

    static async getTreeData(params={}){
        const result = await sendPost('/dataSource/getSourceList', 'post', false, params);
        // const result = {
        //     "databaseSource": [
        //         {
        //             "mongoId": "5aa64cb2848cd544ed491a4a",
        //             "sourceName": "数据库1"
        //         }
        //     ],
        //     "documentSource": [
        //         {
        //             "mongoId": "5aa64c7e848cd544ed491a48",
        //             "sourceName": "文档类型1"
        //         },
        //         {
        //             "mongoId": "5aa64c97848cd544ed491a49",
        //             "sourceName": "文档类型2"
        //         }
        //     ]
        // }

        const documentSource = result.documentSource.map((child, index)=>({title: child.sourceName, key: '0-'+index, value: child.mongoId}));
        const databaseSource = result.databaseSource.map((child, index)=>({title: child.sourceName, key: '1-'+index, value: child.mongoId}));

        return {documentSource, databaseSource}
    };

    static async getTreeNodeDetail(params={}){
        const result = await sendPost('/dataSource/getOne', 'post', false, params);
        // const result =  {
        //     "dataList": [
        //         {
        //             "data": "[{\"id\":1,\"company_name\":\"cname1\",\"company_num\":\"cnum1\",\"company_address\":\"caddress1\",\"people_name\":\"pname1\",\"people_age\":1,\"people_sex\":1,\"stock_no\":1,\"create_time\":1516784013000,\"stock_price\":11}]",
        //             "extractTime": 1489576620000,
        //             "knowledgeCount": 5,
        //             "dataId": "5aab81be1e36be1b681c48ac"
        //         }
        //     ],
        //     "isdel": 0,
        //     "mongoId": "5aa64cb2848cd544ed491a4a",
        //     "source": "databaseSource",
        //     "sourceDescription": "",
        //     "sourceName": "数据库1"
        // }
        result.dataList.map((item, index)=>{
            item.key = item.dataId?item.dataId:'key_'+index;
            item.no = index+1;
        })
        return result.dataList
    };

    static async getDbItemDetail(params={}){
        const result = await sendPost('/dataSource/getOneDetail', 'post', false, params);
    //     const result = {
    //     "dataDetail": {
    //         "_id": "5aab81be1e36be1b681c48ac",
    //         "company_address": "caddress1",
    //         "company_name": "cname1",
    //         "company_num": "cnum1",
    //         "create_time": 1516784013000,
    //         "id": 1,
    //         "people_age": 1,
    //         "people_name": "pname1",
    //         "people_sex": 1,
    //         "stock_no": 1,
    //         "stock_price": 11
    //     },
    //     "knowledge": {
    //         "entity": [
    //             {
    //                 "attribution": "公司员工",
    //                 "attributionValue": "5ab2498c1e36be1d30fa0e05",
    //                 "concept": "5ab2498c1e36be1d30fa0e04",
    //                 "entity": "5ab2498c1e36be1d30fa0e04",
    //                 "relationAttrMap": {},
    //                 "type": "relation"
    //             },
    //             {
    //                 "attribution": "公司股票",
    //                 "attributionValue": "5ab2498c1e36be1d30fa0e06",
    //                 "concept": "5ab2498c1e36be1d30fa0e04",
    //                 "entity": "5ab2498c1e36be1d30fa0e04",
    //                 "relationAttrMap": {},
    //                 "type": "relation"
    //             },
    //             {
    //                 "attribution": "-",
    //                 "attributionValue": "-",
    //                 "concept": "",
    //                 "entity": "cname1",
    //                 "type": "entityAttr"
    //             },
    //             {
    //                 "attribution": "公司编号",
    //                 "attributionValue": "cnum1",
    //                 "concept": "",
    //                 "entity": "cname1"
    //             },
    //             {
    //                 "attribution": "公司地址",
    //                 "attributionValue": "caddress1",
    //                 "concept": "",
    //                 "entity": "cname1"
    //             },
    //             {
    //                 "attribution": "-",
    //                 "attributionValue": "-",
    //                 "concept": "",
    //                 "entity": "pname1",
    //                 "type": "entityAttr"
    //             },
    //             {
    //                 "attribution": "年龄",
    //                 "attributionValue": "1",
    //                 "concept": "",
    //                 "entity": "pname1"
    //             },
    //             {
    //                 "attribution": "性别",
    //                 "attributionValue": "1",
    //                 "concept": "",
    //                 "entity": "pname1"
    //             },
    //             {
    //                 "attribution": "-",
    //                 "attributionValue": "-",
    //                 "concept": "",
    //                 "entity": "股票",
    //                 "type": "entityAttr"
    //             },
    //             {
    //                 "attribution": "股票价格",
    //                 "attributionValue": "11",
    //                 "concept": "",
    //                 "entity": "股票"
    //             },
    //             {
    //                 "attribution": "股票编号",
    //                 "attributionValue": "1",
    //                 "concept": "",
    //                 "entity": "股票"
    //             }
    //         ],
    //         "event": []
    //     }
    // }
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
    //     const result =  {
    //     "dataBusTaskInfo": {
    //         "dataBusUrl": "http://192.168.1.253:8088/query/supermind/mongo1/test1",
    //         "docType": "数据库1",
    //         "jobName": "test10",
    //         "jobType": "全量任务",
    //         "taskId": 95
    //     },
    //     "dataProcessingTaskInfo": {
    //         "d2rPattern": {
    //             "attribution": {
    //                 "0": [
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "company_name"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "name"
    //                     },
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "company_num"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "公司编号"
    //                     },
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "company_address"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "公司地址"
    //                     }
    //                 ],
    //                 "1": [
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "people_name"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "name"
    //                     },
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "people_age"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "年龄"
    //                     },
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "people_sex"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "性别"
    //                     }
    //                 ],
    //                 "2": [
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "stock_no"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "股票编号"
    //                     },
    //                     {
    //                         "among": " ",
    //                         "fields": [
    //                             "stock_price"
    //                         ],
    //                         "mongoId": "",
    //                         "typeName": "股票价格"
    //                     }
    //                 ]
    //             },
    //             "entity": [
    //                 {
    //                     "id": "0",
    //                     "mongoId": "",
    //                     "typeName": "公司"
    //                 },
    //                 {
    //                     "id": "1",
    //                     "mongoId": "",
    //                     "typeName": "人"
    //                 },
    //                 {
    //                     "id": "2",
    //                     "mongoId": "",
    //                     "typeName": "股票"
    //                 }
    //             ],
    //             "event": [],
    //             "relation": [
    //                 {
    //                     "end": "1",
    //                     "id": "0",
    //                     "mongoId": "",
    //                     "start": "0",
    //                     "typeName": "公司员工"
    //                 },
    //                 {
    //                     "end": "2",
    //                     "id": "1",
    //                     "mongoId": "",
    //                     "start": "0",
    //                     "typeName": "公司股票"
    //                 }
    //             ],
    //             "relationAttr": {}
    //         },
    //         "jobName": "test10",
    //         "modelName": "D2R",
    //         "taskId": 96
    //     },
    //     "mongoId": "5aa64cb2848cd544ed491a4a",
    //     "source": "databaseSource",
    //     "sourceDescription": "",
    //     "sourceName": "数据库1"
    // }
        return result
    };



    //db add child API
    static async handleAddNewTagSave(params={}){
        const result = await sendPost('/dataSource/addOne', 'post', false, params);

        return result
    };

    static async handleAddNewTagSave2(params={}){
        const result = await sendPost('/task/addOne', 'post', false, params);

        return result
    };

    static async getOneSamples(params={}){
        const result = await sendPost('/dataSource/getOneSamples', 'post', false, params);

        return result
    };


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
