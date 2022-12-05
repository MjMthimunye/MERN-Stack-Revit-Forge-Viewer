const dbConfig = require('../config/dbConfig');
const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.localUrl = dbConfig.localUrl;
db.cloudUrl = dbConfig.cloudUrl;

module.exports = db;