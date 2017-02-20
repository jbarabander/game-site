var Db = require('./odm')
var dbInstance = new Db('mongodb://localhost/game')

module.exports = dbInstance