import sendPost from './commonApi';
import moment from 'moment';

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
            item.key = item.dataId?item.dataId:'key_'+index;
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

    //数据库添加操作第一步
    static async handleAddNewTagSave(params={}){
        const result = await sendPost('/dataSource/addOne', 'post', false, params);

        return result
    };
    //数据库添加操作第二步
    static async handleAddNewTagSave2(params={}){
        const result = await sendPost('/task/addOne', 'post', false, params);

        return result
    };
    //数据库添加操作第二步中的样例查看
    static async getOneSamples(params={}){
        const result = await sendPost('/dataSource/getOneSamples', 'post', false, params);

        return result
    };
    //数据库添加操作第三步中的mapping配置中的第一步的概念树种的父节点接口
    static async selectConceptByPid(params={}){
        const result = await sendPost('/knowledgeGraph/selectConceptByPid', 'get', false, params);

        return result
    };
    //数据库添加操作第三步中的mapping配置中的第一步的概念树中获取子节点
    static async selectConceptById(params={}){
        const {id,type} = params;
        const result = await sendPost('/knowledgeGraph/selectConceptById', 'get', false, {id});
        if (type === 'attr') {
            return result.attrList.map(item=>{
                return {
                    title: item.name,
                    key: item.id
                }
            })
        }else if (type === 'relation') {
            return result.relationList.map(item=>{
                return {
                    title: item.name,
                    key: item.id,
                    attrList: item.attrList
                }
            })
        }
    };
    //数据库添加操作第三步中的mapping配置中的第二步中的数据表树
    static async getOneFields(params={}){
        const result = await sendPost('/dataSource/getOneFields', 'post', false, params);

        return result.map(item=>{
            return {
                title: item,
                key: item
            }
        })
    };

    //任务管理，获取右侧列表接口
    static async getTaskList(params={}){
        const result = await sendPost('/task/getTaskList', 'post', false, params);
        result.map((item,index)=>{
            item.index = index+1;
            item.key = index;
            item.createTime = item.createTime?moment(item.createTime).format('YYYY-MM-DD'):'暂无';
            item.updateTime = item.updateTime?moment(item.updateTime).format('YYYY-MM-DD'):'暂无';
        })
        return result
    };

    //删除数据源
    static async deleteOne(params={}){
        const result = await sendPost('/dataSource/deleteOne', 'post', false, params);

        return result
    };

    //删除任务管理列表Item
    static async taskDeleteOne(params={}){
        const result = await sendPost('/task/deleteOne', 'post', false, params);

        return result
    };

    //任务管理保存接口
    static async updateOneInfo(params={}){
        const result = await sendPost('/task/updateOneInfo', 'post', false, params);

        return result
    };

    //任务管理启动
    static async pauseOne(params={}){
        const result = await sendPost('/task/pauseOne', 'post', false, params);

        return result
    };

    //任务管理暂停
    static async resumeOne(params={}){
        const result = await sendPost('/task/resumeOne', 'post', false, params);

        return result
    };

    //数据源基础信息更新
    static async updateOne(params={}){
        const result = await sendPost('/dataSource/updateOne', 'post', false, params);

        return result
    };

    //添加文档库第三步的数据模型
    static async getPipelineList(params={}){
        const result = await sendPost('/dataSource/getPipelineList', 'post', false, params);

        return result
    };

}
