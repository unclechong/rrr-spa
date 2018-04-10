const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const axios = require('axios');
var fs = require("fs");

app.use(bodyParser());
// 具体参数我们在后面进行解释
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/supermind/api') {
            return "*"; // 允许来自所有域名请求
        }
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', ],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


//const URL = 'http://192.168.1.181:8088/supermind/api';
const URL = 'http://192.168.1.253:8088/supermind/api';
//

//当请求时GET请求时，显示表单让用户填写
app.use(async(ctx)=>{
    if(ctx.url === '/supermind/api' && ctx.method==='POST'){
        let {rest, params, method, keyPath, method:_method} = ctx.request.body;
        //rest 暂未转化成 URL 参数
        const postURL = URL + keyPath + '?config_id=14';
        try{
            if (keyPath === '/getServerUrl') {
                ctx.body = {
                    header: {
                        code: 0,
                        message: `success`
                    },
                    body: {
                        url: URL
                    }
                };
            }else {
                console.log(postURL);
                console.log(JSON.stringify(params));
                // const aa = await axios.get('http://192.168.1.253:8088/supermind/api/knowledgeGraph/exportEntityInstance?pid=5aab4f0e848cd544ed491f6b')
                const data = await axios[_method](postURL, _method==='get'?{params}:params);
                ctx.body = data.data;
            }

        }catch (err) {
            if (err.response.status === 500) {
                ctx.body = {
                    header: {
                        code: 1,
                        message: 'server 500'
                    }
                };
            }else {
                ctx.body = {
                    header: {
                        code: 1,
                        message: `other server error ---${err.response.status}`
                    }
                };
            }
        }
    }else{
        ctx.body = {
            header: {
                code: 0,
                message: 'no API'
            }
        };
    }
});

app.listen(7771,()=>{
    console.log('[demo] server is starting at port 3000');
})
