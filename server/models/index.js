var Db = require('../odm/db')
var db = new Db('mongodb://localhost/game')
var weaponSchema = require('./Weapon')
db.model('weapons', weaponSchema)
