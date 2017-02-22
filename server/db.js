const Tiny = require('tiny-mongo')
const uri = require('electrode-confippet').config.$("settings.db")
const dbInstance = new Tiny(uri)

module.exports = dbInstance