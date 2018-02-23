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
    .then(response=>{
        return response.data
    })
    .catch(err=>{
        console.log(err);
    });
}

export default sendPost
