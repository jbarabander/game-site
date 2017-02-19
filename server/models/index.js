var Db = require('../odm/db')
var db = new Db('mongodb://localhost/game')

db.model('weapons', {name: String})