import sendPost from './commonApi';

export default class typesystemApi {
    
    static async getTagList(params={}){
        const taglist = await sendPost('./test/test.json','get',params);
        return taglist
    };

    static async search(params={}){
        const result = await sendPost('./test/search.json','get',params);
        return result
    };
}
