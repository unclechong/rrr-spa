import sendPost from './commonApi';

export default class knowledgegraphApi {

    static async selectConceptByPid(params={}){
        const result = await sendPost('/knowledgeGraph/selectConceptByPid', 'get', false, params);
        return result
    };

    static async selectConceptById(params={}){
        const result = await sendPost('/knowledgeGraph/selectConceptById', 'get', false, params);
        return result
    };

    //更新当前概念
    static async updateConceptBaseInfoById(params={}){
        const result = await sendPost('/knowledgeGraph/updateConceptBaseInfoById', 'get', false, params);
        return result
    };

    //在当前概念节点下面新增一条子概念
    static async insertConceptReturnId(params={}){
        const result = await sendPost('/knowledgeGraph/insertConceptReturnId', 'get', false, params);
        return result
    };

    //删除当前id的概念
    static async deleteConceptById(params={}){
        const result = await sendPost('/knowledgeGraph/deleteConceptById', 'get', false, params);
        return result
    };

    //事件列表 --- 根据当前事件类型获取对应事件列表详情
    static async listEventByType(params={}){
        const result = await sendPost('/knowledgeGraph/listEventByType', 'get', false, params);
        return result
    };

    static async exportEntityInstance(params={}){
        const result = await sendPost('/knowledgeGraph/exportEntityInstance', 'get', false, params);
        return result
    };

}
