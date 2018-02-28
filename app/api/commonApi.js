const URL = 'http://192.168.1.156:8088/supermind/api';

const sendPost = (path, method='get', isJson=false, params, onError) => {
    const sendParams = method=='get'?{params}:params;
    // axios.defaults.withCredentials=true;
    //axios.defaults.XDomainRequest = true;
    // axios.defaults.timeout=60000;
    // axios.defaults.headers['Content-Type']='application/json;charset=UTF-8';
    return axios[method.toLowerCase()](
        isJson?path:URL+path,
        sendParams
    )
    .then(res=>{
        const {data:{header,body}} = res;
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

export default sendPost
