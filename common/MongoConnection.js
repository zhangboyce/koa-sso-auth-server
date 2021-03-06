'use strict';

let mongoClient = require('mongodb').MongoClient;

let dbPool = {};
module.exports = {
    connect: (url, dbname, callback) => {
        if (!dbPool[dbname]) {
            mongoClient.connect(url).then(db => {
                dbPool[dbname] = db;
                console.log("Connect mongo db: " + url);
                callback();
            }).catch(err => {
                console.error(err);
            });
        } else {
            return dbPool[dbname];
        }
    },
    get: dbname => {
        return dbPool[dbname];
    }
};
