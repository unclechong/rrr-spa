import sendPost from './commonApi';
import moment from 'moment';

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

    //事件列表 --- 根据当前事件类型获取对应事件列表
    static async listEventByType(params={}){
        const result = await sendPost('/knowledgeGraph/listEventByType', 'get', false, params);
        const list = result.map(item=>{
            return {
                eventName: item.location,
                eventTime: item.eventTime?moment(item.eventTime).format('YYYY-MM-DD'):'暂无',
                title: item.externalInfo.title,
                url: item.externalInfo.url,
                key: item.resourceId
            }
        })
        return list
    };

    //查看当前实体的实例
    static async selectEntityByPid(params={}){
        const result = await sendPost('/knowledgeGraph/selectEntityByPid', 'get', false, params);
        const data = result.map(item=>{
            return {
                name: item.name,
                desc: item.description,
                attr: item.attrMap,
                key: item.id
            }
        })

        return data
    };

    //更新概念下面的关系 step1
    static async updateRelationOrAttribute(params={}){
        const result = await sendPost('/knowledgeGraph/updateRelationOrAttribute', 'post', false, params);

        return result
    };

    //更新概念下面的关系 step2
    static async updateConceptAttribute(params={}){
        const result = await sendPost('/knowledgeGraph/updateConceptAttribute', 'post', false, params);

        return result
    };

    //新增概念下面的关系
    static async insertRelationOrAttribute(params={}){
        const result = await sendPost('/knowledgeGraph/insertRelationOrAttribute', 'post', false, params);

        return result
    };

    //在快速添加时调用，获取推荐的属性
    static async selectRecommendRelationOrAttribute(params={}){
        const result = await sendPost('/knowledgeGraph/selectRecommendRelationOrAttribute', 'get', false, params);

        return result
    };

    //上传文件
    static async importEntityInstance(params={}){
        // const result = await sendPost('/knowledgeGraph/importEntityInstance', 'get', false, params);
        //
        // return result
        //
        // await axios.post('http://localhost:7771/supermind/api', params.formData, {
        //       headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //       }
        // });
    };



    // static async exportEntityInstance(params={}){
    //     const result = await sendPost('/knowledgeGraph/exportEntityInstance', 'get', false, params);
    //     return result
    // };

}
