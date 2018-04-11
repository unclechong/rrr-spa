import sendPost from './commonApi';

export default class typesystemApi {

    static async getTagList(params={}){
        const data = await sendPost('/type/getTypeList', 'post', false, params);
        // const data = await sendPost('/test/test.json', 'get', true, params);
        let taglist = {};
        _.forOwn(data,(v,k)=>{
            taglist[k] = v.map(item=>({key: item.mongoId, value: item.mongoId, label: item.typeName}));
        })
        return taglist
    };

    static async search(params={}){
        const result = await sendPost('./test/search.json', 'get', true, params);
        return result
    };

    static async getTagDesc(params={}){
        const result = await sendPost('/type/getOne', 'post', false, params);
        const {isdel, mongoId, type, ...rest} = result;
        const returnObj = {};
        _.forOwn(rest, (v, k)=>{
            if (k === 'entityType_end' || k === 'entityType_start') {
                returnObj[k] = {value: v.mongoId};
                // returnObj[k] = {value: v.mongoId+'|'+v.typeName};
            }else if (k === 'belongedType') {
                // returnObj[k] = {value: v.map(_v=>_v.mongoId+'|'+_v.typeName)};
                returnObj[k] = {value: v.map(_v=>_v.mongoId)};
            }else {
                returnObj[k] = {value: v};
            }
        })
        return returnObj
    }

    static async deleteTag(params={}){
        // const result = await sendPost('/type/getOne?config_id=13', 'post', true, params);
        const result = await sendPost('/type/deleteOne', 'post', false, params);
        return true
    }

    static async addTag(params={}){
        // const result = await sendPost('/type/getOne?config_id=13', 'post', true, params);
        const result = await sendPost('/type/addOne', 'post', false, params);
        return result
    }

    static async updateTag(params={}){
        // const result = await sendPost('/type/getOne?config_id=13', 'post', true, params);
        const result = await sendPost('/type/updateOne', 'post', false, params);
        return result
    }
}
