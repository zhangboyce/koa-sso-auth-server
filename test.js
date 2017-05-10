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
   let encodePassword = Utils.md5ByString('1' + Utils.salt);

   console.log('--' + encodePassword);
}

function _config() {
   var config = require('config');
   console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
   console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
   console.log('NODE_CONFIG: ' + config.util.getEnv('NODE_CONFIG'));
   console.log('HOSTNAME: ' + config.util.getEnv('HOSTNAME'));
   console.log('NODE_APP_INSTANCE: ' + config.util.getEnv('NODE_APP_INSTANCE'));
}

encodePassword();