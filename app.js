'use strict';
const path = require('path');
const koa = require('koa');
const logger = require('koa-logger');
const render = require('koa-swig');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const config = require('config');
const KoaRouter = require('koa-router')();

const app = koa();
app.context.render = render({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    ext: 'html'
});

app.use(function *(next) {
    try {
        yield next;
    }catch(e) {
        console.error(e);
        this.body = { status: false, message: '系统内部错误,请联系管理员!' }
    }
});

app.keys = ['cce-ato-sso-2016','keys'];
app.use(session({
    store: redisStore(config.get('redis'))
}));

// routers
const apiRouter = require('./server_routers/api.router.js');
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.use(require('koa-static')(path.join(__dirname, 'build')));
app.use(require('koa-static-server')({rootDir: 'public', rootPath: '/public'}));

// route the path to render index
KoaRouter.get("/*", function *() {
    yield this.render('index');
});
app.use(KoaRouter.routes()).use(KoaRouter.allowedMethods());

const MongoConnection = require('./common/MongoConnection');
MongoConnection.connect(config.get('mongo.boom'), 'boom', () => {
    let port = config.get('port');
    app.listen(port);
    console.log('cce-ato-sso listening on port ' + port);
});