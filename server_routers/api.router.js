'use strict';
const parse = require('co-body');
const router = require('koa-router')();
const config = require('config');

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(config.get('redis'));

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
    let account = yield db.collection('accounts').findOne({ username: email });
    if (!account) {
        this.body = { status: false, message: '该邮箱还没有注册!' };
        return;
    }

    if (!account.validDate) {
        this.body = { status: false, message: '请您登录邮箱完成校验!' };
        return;
    }

    let validCode = Utils.random();
    let validUrl = config.get('host') + '/user/toResetPassword?code=' + validCode;
    yield db.collection('accounts').update({ _id: account._id }, { $set: { validCode: validCode } });

    yield EmailUtils.sendEmail(email, 'forget-password.template.html', { url: validUrl });

    // TODO redirect a page to tell send ok
    this.body = { status: true };
});

router.get('/user/toResetPassword', function *() {
    let code = this.query.code;
    if (!code) {
        this.body = '<script>alert("别闹...我错了");location.href="/user/login";</script>';
        return;
    }
    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ validCode: code });
    if (!account) {
        this.body = ('<script>alert("链接已经失效");location.href="/user/login";</script>');
        return;
    }
    if (!account.validDate) {
        this.body = ('<script>alert("请先通过邮箱校验");location.href="/user/login";</script>');
        return;
    }
    this.redirect('/user/resetPassword?code='+ code );
});


router.post('/api/user/resetPassword', function *() {
    let data = yield parse(this);
    let code = data.code;
    let password = data.password;

    if (!code || !password) {
        this.body = { status: false, message: '找不到验证码' };
        return;
    }

    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ validCode: code });
    if (!account) {
        this.body = { status: false, message: '链接已经失效' };
        return;
    }
    if (!account.validDate) {
        this.body = { status: false, message: '您的邮箱地址还没通过验证' };
        return;
    }

    yield db.collection('accounts').updateOne({ validCode: code }, { $set: { password: password, validCode: null } });

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


//router.post('/register', function *() {
//    let data = yield parse(this);
//    let username = data.username;
//    let password = data.password;
//    let account = yield Account.findOne({username: username});
//    if (account) {
//        this.body = {status: 'fail', message: '该邮箱已注册'};
//        return;
//    }
//    account = new Account({
//        username: username,
//        password: encodePassword(password),
//        dateCreated: new Date(),
//        validCode: idUtil.random()
//    });
//    yield account.save();
//    yield emailUtil.sendMail(account.username, '[脑洞]邮件校验', config.get('host') + '/valid/' + account.validCode);
//    this.body = {status: 'success'};
//});
//
//router.get('/valid/:code', function *() {
//    let code = this.params.code;
//    let account = yield Account.findOne({validCode: code});
//    if (account) {
//        if (account.validDate) {
//            this.body = '<script>alert("您已经通过注册校验");location.href="/login";</script>';
//        }else {
//            yield Account.update({_id: account._id}, {$set: {'validDate': new Date()}});
//            this.body = '<script>alert("您已经通过注册校验,请登录");location.href="/login";</script>';
//        }
//    } else {
//        this.body = '<script>alert("error");location.href="/login";</script>';
//    }
//});
//
//router.get('/forget', function *() {
//    yield this.render('login/forget');
//});
//
//router.post('/resetEmail', function *() {
//    let data = yield parse(this);
//    let email = data.email;
//    let account = yield Account.findOne({username: email});
//    if (account.validDate) {
//        account.validCode = idUtil.random();
//        yield account.save();
//        yield emailUtil.sendMail(email, '[脑洞]重置密码', config.get('host') + '/resetPassword/' + account.validCode);
//        this.body = ({status: 'success'});
//        return;
//    }
//    this.body = {status: 'invalid'};
//});
//
//router.get('/resetPassword/:code', function *() {
//    let code = this.params.code;
//    if (!code) {
//        this.body = '<script>alert("别闹...我错了");location.href="/login";</script>';
//        return;
//    }
//    let account = yield Account.findOne({validCode: code});
//    if (!account) {
//        this.body = ('<script>alert("链接已经失效");location.href="/login";</script>');
//        return;
//    }
//    if (!account.validDate) {
//        this.body = ('<script>alert("请先通过邮箱校验");location.href="/login";</script>');
//        return;
//    }
//    yield this.render('login/resetPassword', {code: code});
//});
//
//router.post('/resetUpdatePassword', function *() {
//    let data = yield parse(this);
//    let code = data.code;
//    let password = data.password;
//    if (!code || !password) {
//        this.body = ('<script>alert("别闹...我错了");location.href="/login";</script>');
//        return;
//    }
//    let account = yield Account.findOne({validCode: code});
//    if (!account) {
//        this.body = ('<script>alert("链接已经失效");location.href="/login";</script>');
//        return;
//    }
//    if (!account.validDate) {
//        this.body = ('<script>alert("请先通过邮箱校验");location.href="/login";</script>');
//        return;
//    }
//    account.password = encodePassword(password);
//    account.validCode = null;
//    yield account.save();
//    this.body = ({status: 'success'});
//});
//
//router.get('/logout', function *() {
//    this.session = null;
//    this.redirect('/');
//});


module.exports = router;