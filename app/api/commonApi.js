import appConf from '../conf';
const sendPost = (path, method='get', isJson=false, params, onError) => {
    // const sendParams = method=='get'?{params}:params;
    const sendParams = params;

    const proxyParams = {
        params: sendParams,
        rest: {
            config_id: '14'
        },
        keyPath: path,
        method
    }
    if (isJson){
        return axios.get(
            path
        )
        .then(res=>{
            const {data: {header,body}} = res;
            // return header.code === '0' || header.code === 0 ? {body} : {status: false, message: message, data: {}}
            if (header.code === '0' || header.code === 0) {
                return body || {}
            }
            if (onError) {
                onError(header);
            }else {
                // error message todo
                console.log(header.message);
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }else {
        return axios.post(
            // isJson?path:URL+path,
            appConf.SERVER_URL,
            proxyParams
        )
        .then(res=>{
            const {data: {header,body}} = res;
            // return header.code === '0' || header.code === 0 ? {body} : {status: false, message: message, data: {}}
            if (header.code === '0' || header.code === 0) {
                return body || {}
            }
            if (onError) {
                onError(header);
            }else {
                // error message todo
                console.log(header.message);
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
}



async function getServerUrl(params={}){
    const result = await sendPost('/getServerUrl', 'post', false, params);
    return result
};

export {getServerUrl}

export default sendPost
