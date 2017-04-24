'use strict';

const uuid = require('node-uuid');
const crypto = require('crypto');
const salt = 'CCeGROUp-BOOM';

function random() {
    var uid = uuid.v1();
    var md5 = crypto.createHash('md5');
    md5.update(uid);
    return md5.digest('hex');
}

function md5ByString(str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

function isUrl(url) {
    if (!url) return false;

    let exp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    let regex = new RegExp(exp);

    return url.match(regex) ? true : false;
}

module.exports = { isUrl, random, md5ByString, salt };

console.log(isUrl('127.0.0.1:18888/api/getToken'));