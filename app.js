'use strict';
const path = require('path');
const koa = require('koa');
const logger = require('koa-logger');
const render = require('koa-swig');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const config = require('config');

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
        this.body = { status: false, message: 'System internal error!' }
    }
});

app.keys = ['cce-ato-sso-2016','keys'];
app.use(session({
    store: redisStore(config.get('redis'))
}));

// routers
const apiRouter = require('./server_routers/api.router.js');
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
app.use(logger());

app.use(require('koa-static')(path.join(__dirname, 'build')));
app.use(require('koa-static-server')({rootDir: 'public', rootPath: '/public'}));

const MongoConnection = require('./common/MongoConnection');
MongoConnection.connect(config.get('mongo.boom'), 'boom');

let port = config.get('port');
app.listen(port);
console.log('cce-ato-sso listening on port ' + port);