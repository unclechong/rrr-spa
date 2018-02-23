import sendPost from './commonApi';

export default class typesystemApi {
    // static getUser() {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve(Object.assign({}, {
    //                 email: "andresmijares@gmail.com",
    //                 repository: "https://github.com/andresmijares/distributed-async-react-redux-saga"
    //             }));
    //         }, 3000);
    //     });
    // }

    static async gettargetlist(params={}){
        const data = await sendPost('./test/test.json','get',params);
        console.log(data);
        return data
    };
}
