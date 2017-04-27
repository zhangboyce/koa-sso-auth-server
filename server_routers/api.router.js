'use strict';
const parse = require('co-body');
const router = require('koa-router')();
const config = require('config');

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(config.get('redis'));

const _ = require('lodash');
const MongoConnection = require('../common/MongoConnection');
const Utils = require('../common/Utils');
const EmailUtils = require('../email/EmailUtils');

router.get('/', function *() {
    this.redirect('user/login' + this.search);
});

router.get('/user/login', function *() {
    let token = this.session.token;
    let account = yield client.getAsync('token-' + token);
    let default_system = config.get('sso.default_system');

    if (token && account) {
        let auth_callback = this.query.auth_callback;
        if (!auth_callback) {
            this.redirect(default_system);
        } else {
            let code = yield generateCode(token);
            this.redirect(auth_callback + '?code=' + code);
        }
    } else {
        client.del('token-' + token);
        this.session = null;

        yield this.render('index', { config: { default_system: default_system }});
    }
});

router.get('/api/user/logout', function *() {
    let token = this.session.token;
    client.del('token-' + token);
    this.session = null;

    let auth_callback = this.query.auth_callback;
    this.redirect('/?auth_callback=' + auth_callback);
});

router.get('/api/code/check', function *() {
    let code = this.query.code;
    if (code) {
        let token = yield client.getAsync('code-' + code);
        if(!token) {
            this.body = { status: false, message: 'code已过期, 请重新获取' };
            return;
        }
        let account = yield client.getAsync('token-' + token);
        if (!account) {
            this.body = { status: false, message: 'token已过期, 请重新登录' };
            return;
        }
        this.body = { status: true, result: token };

    } else {
        this.body = { status: false, message: '没有找到code' };
    }
});

router.get('/api/token/check', function *() {
    let token = this.query.token;
    if (!token) {
        this.body = { status: false, message: '没有找到token' };
        return;
    }
    let account = yield client.getAsync('token-' + token);
    if(!account) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    this.body = { status: true };
});

router.get('/api/getUserInfo', function *() {
    let token = this.query.token;
    if (!token) {
        this.body = { status: false, message: '没有找到token' };
        return;
    }
    let account = yield client.getAsync('token-' + token);
    if(!account) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    this.body = { status: true, result: account };
});

router.post('/api/user/login', function *() {
    let token = this.session.token;
    let account = yield client.getAsync('token-' + token);
    let data = yield parse(this);

    // had login
    if (token && account) {
        let code = yield generateCode(token);
        this.body = { status: true, result: code };
    } else {
        let username = data.username;
        let password = data.password;

        let db = MongoConnection.get('boom');
        account = yield db.collection('accounts').findOne({ username: username });

        if (!account) {
            this.body = { status: false, message: '该用户名还没有注册!' };
            return;
        }

        if (account.password !== password) {
            this.body = { status: false, message: '用户名或密码不正确!' };
            return;
        }

        if (!account.validDate) {
            this.body = { status: false, message: '请您登录邮箱完成校验!' };
            return;
        }

        client.del('token-' + token);
        token = yield generateToken(account);
        let code = yield generateCode(token);
        this.session.token = token;

        this.body = { status: true, result: code };
    }
});

router.post('/api/user/sendForgetPasswordEmail', function *() {
    let data = yield parse(this);
    let email = data.email;

    let db = MongoConnection.get('boom');
    let account = yield db.collection('account').findOne({ username: email });

    if (!account) {
        this.body = { status: false, message: '该邮箱还没有注册!' };
        return;
    }

    if (!account.validDate) {
        this.body = { status: false, message: '请您登录邮箱完成校验!' };
        return;
    }

    let validCode = Utils.random();
    let validUrl = '';
    yield db.collection('account').update({ _id: account._id }, { $set: { validCode: validCode } });

    EmailUtils.sendEmail(email, 'forget-password.template.html', { url: validUrl });

    this.body = { status: true };
});

function * generateCode(token) {
    let code = Utils.random();
    yield client.setAsync('code-' + code, token);
    yield client.expireAsync('code-' + code, 5);
    return code;
}

function * generateToken(account) {
    let token = Utils.random();
    yield client.setAsync('token-' + token, JSON.stringify(account));
    return token;
}

module.exports = router;