const sendPost = (url,method='get',params) => {
    const sendParams = method=='get'?{params}:params;
    axios.defaults.withCredentials=true;
    //axios.defaults.XDomainRequest = true;
    axios.defaults.timeout=60000;
    // axios.defaults.headers['Content-Type']='application/json;charset=UTF-8';
    return axios[method.toLowerCase()](
        url,
        sendParams
    )
    .then(res=>{
        const {data:{header,body}} = res;
        return header.code === '200' ? body : false
    })
    .catch(err=>{
        console.log(err);
    });
}

export default sendPost
