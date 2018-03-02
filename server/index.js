const Koa = require('koa')
const app = new Koa()
const views = require('koa-views');
const path = require('path');

app.use(require('koa-static')(path.join(__dirname, '../build')));
app.use(views(path.join(__dirname, '../views'), {
    extension: 'html'
}));

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


app.use(async (ctx) => {
    await ctx.render('index.html');
});

app.listen(7770);
