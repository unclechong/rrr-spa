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


const URL = 'http://192.168.1.253:8088/supermind/api';

//当请求时GET请求时，显示表单让用户填写
app.use(async(ctx)=>{
    if(ctx.url === '/supermind/api' && ctx.method==='POST'){
        let {rest, params, method, keyPath} = ctx.request.body;
        //rest 暂未转化成 URL 参数
        const postURL = URL + keyPath + '?config_id=14';
        const data = await axios.post(postURL, params);
        ctx.body = data.data;
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