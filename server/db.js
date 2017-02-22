var Tiny = require('tiny-mongo')
var dbInstance = new Tiny('mongodb://localhost/game')

module.exports = dbInstance