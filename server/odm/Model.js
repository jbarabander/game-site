var Cursor = require('./Cursor')
class Model {
  constructor (name, schema, dbPromise) {
    this.__collection = null
    this.name = name
    this.schema = schema
    this.__collectionPromise = dbPromise.then(db => {
      this.__collection = db.collection(this.name)
      return this.__collection
    })
  }

  giveCursorBack (method, arguments) {
    return new Cursor(this.__collectionPromise, method, arguments)
  }

  find () {
    return this.giveCursorBack(method, arguments)
  }
  findOne () {
    return this.giveCursorBack(method, arguments)
  }
  update () {
    return this.__collectionPromise.then(function (collection) {
      return collection.update(arguments)
    })
  }
}

module.exports = Model
