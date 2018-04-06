const Koa = require('koa')
const app = new Koa()
const views = require('koa-views');
const path = require('path');
// const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const axios = require('axios');

const SERVER_URL = 'http://192.168.1.253:8088/supermind/api';

app.use(bodyParser());

app.use(require('koa-static')(path.join(__dirname, '../build')));

app.use(views(path.join(__dirname, '../views'), {
    extension: 'html'
}));

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
});

// 具体参数我们在后面进行解释
// app.use(cors({
//     origin: function (ctx) {
//         if (ctx.url === '/supermind/api') {
//             return "*"; // 允许来自所有域名请求
//         }
//     },
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//     maxAge: 5,
//     credentials: true,
//     allowMethods: ['GET', 'POST', ],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }))

//当请求时GET请求时，显示表单让用户填写
app.use(async(ctx,next)=>{
    if(ctx.url === '/supermind/api' && ctx.method==='POST'){
        let {rest, params, method, keyPath, method:_method} = ctx.request.body;
        //rest 暂未转化成 URL 参数
        const postURL = SERVER_URL + keyPath + '?config_id=14';
        if (keyPath === '/getServerUrl') {
            ctx.body = {
                header: {
                    code: 0,
                    message: `success`
                },
                body: {
                    url: SERVER_URL
                }
            };
        }else {
            const data = await axios[_method](postURL, _method==='get'?{params}:params);
            ctx.body = data.data;
        }

    }else{
        await next();
    }
});


app.use(async (ctx, next) => {
    await ctx.render('index.html');
});


app.listen(7770);
