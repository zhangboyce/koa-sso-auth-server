let config = require('config');

function testRedis() {
   let redis = require('redis');
   let client = redis.createClient(config.get('redis'));
   const bluebird = require('bluebird');
   bluebird.promisifyAll(redis.RedisClient.prototype);
   bluebird.promisifyAll(redis.Multi.prototype);

   client.delAsync('sso-code-zD76W98hdCyySNUc3BBSPKZl0rAIYlgM').then(rs => {
      console.log(rs);
   });

   client.quit();
}

function encodePassword() {
   const Utils = require('./common/Utils');
   let encodePassword = Utils.md5ByString('123' + Utils.salt);

   console.log('--' + encodePassword);
}

function _config() {
   console.log(config.list());
}

_config();