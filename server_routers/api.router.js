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
const ObjectID = require('mongodb').ObjectID;

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
    let validUrl = config.get('host') + '/user/resetPassword?code=' + validCode;
    yield db.collection('accounts').update({ _id: account._id }, { $set: { validCode: validCode } });

    yield EmailUtils.sendEmail(email, 'forget-password.template.html', { url: validUrl });

    // TODO redirect a page to tell send ok
    this.body = { status: true };
});

router.get('/user/resetPassword', function *() {
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
    yield this.render('index');

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

router.post('/api/user/register', function *() {
    let data = yield parse(this);
    let email = data.email;
    let password = data.password;

    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (account) {
        this.body = { status: false, message: '该邮箱已被注册' };
        return;
    }

    let validCode = Utils.random();
    yield db.collection('accounts').insert({ username: email, password: password, dateCreated: new Date(), validCode: validCode });

    let validUrl = config.get('host') + '/api/user/valid?code=' + validCode + '&email=' + email;
    yield EmailUtils.sendEmail(email, 'register-valid.template.html', { url: validUrl});
    this.body = { status: true };

});

router.get('/user/registerOk', function *() {
    let email = this.query.email;

    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (!account) {
        this.body = '<script>alert("邮箱没有被注册");location.href="/user/login";</script>';
    }
    yield this.render('index');
});

router.post('/api/user/sendRegisterValidEmail', function *() {
    let data = yield parse(this);
    let email = data.email;

    if (!email) {
        this.body = { status: false, message: '找不到邮箱地址' };
        return;
    }

    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (!account) {
        this.body = { status: false, message: '该邮箱没有注册' };
        return;
    }

    if (account.validDate) {
        this.body = { status: false, message: '该邮箱已通过验证' };
        return;
    }

    let validCode = Utils.random();
    let validUrl = config.get('host') + '/api/user/valid?code=' + validCode + '&email=' + email;

    yield db.collection('accounts').updateOne({ _id: account._id}, { $set: { validCode: validCode } });
    yield EmailUtils.sendEmail(email, 'register-valid.template.html', { url: validUrl });
    this.body = { status: true };

});

router.get('/api/user/valid', function *() {
    let code = this.query.code;
    let email = this.query.email;

    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ validCode: code });
    if (account) {
        if (account.validDate) {
            this.body = '<script>alert("您已经通过注册校验");location.href="/user/login";</script>';
        }else {
            yield db.collection('accounts').update({ _id: account._id }, { $set: { validDate : new Date() }});
            this.body = '<script>alert("您已经通过注册校验,请登录");location.href="/user/login";</script>';
        }
    }else {
        let redirectUrl = '/user/registerOk?email=' + email;
        this.body = '<script>alert("链接已过期,请重新发送");location.href="' + redirectUrl +'";</script>';
    }
});

router.get('/userCenter', function *() {
    let token = this.session.token;
    if (!token) {
        this.body = '<script>alert("登录已过期, 请重新登录");location.href="/user/login";</script>';
    }
    let account = yield client.getAsync('token-' + token);
    if(!account) {
        this.body = '<script>alert("登录已过期, 请重新登录");location.href="/user/login";</script>';
    }

    yield this.render('index');
});

router.get('/api/userCenter/getUserInfo', function *() {
    let token = this.session.token;
    if (!token) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    let account = yield client.getAsync('token-' + token);
    if(!account) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    account = JSON.parse(account);

    let db = MongoConnection.get('boom');
    account = yield db.collection('accounts').findOne({ _id: new ObjectID(account._id) }, { password: 0, validCode: 0, validDate: 0 });

    this.body = { status: true, result: account };
});

router.post('/api/userCenter/updateUserInfo', function *() {

    let token = this.session.token;
    if (!token) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    let oldAccount = yield client.getAsync('token-' + token);
    if(!oldAccount) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    oldAccount = JSON.parse(oldAccount);

    let data = yield parse(this);
    let account = data.account;

    if (account._id !== oldAccount._id) {
        this.body = { status: false, message: '用户信息有误,不能修改' };
        return;
    }

    let _id = new ObjectID(account._id);
    delete account.username;
    delete account._id;

    let db = MongoConnection.get('boom');
    yield db.collection('accounts').update({ _id:  _id }, { $set:  account });
    this.body = { status: true };

});

router.post('/api/userCenter/updatePassword', function *() {
    let token = this.session.token;
    if (!token) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    let oldAccount = yield client.getAsync('token-' + token);
    if(!oldAccount) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    oldAccount = JSON.parse(oldAccount);

    let data = yield parse(this);
    let _id = data._id;
    let oldPassword = data.oldPassword;
    let newPassword = data.newPassword;

    if (_id !== oldAccount._id) {
        this.body = { status: false, message: '用户信息有误,不能修改' };
        return;
    }

    let db = MongoConnection.get('boom');
    let account = yield db.collection('accounts').findOne({ _id: new ObjectID(_id) });
    if (account.password !== oldPassword) {
        this.body = { status: false, message: '输入的旧密码不正确' };
        return;
    }

    yield db.collection('accounts').update({ _id:  account._id }, { $set:  { password: newPassword } });

    // logout
    client.del('token-' + token);
    this.session = null;

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