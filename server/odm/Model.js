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

  giveCursorBack (method, args) {
    return new Cursor(this.__collectionPromise, method, args)
  }

  find () {
    var args = arguments
    return this.giveCursorBack('find', args)
  }
  findOne () {
    var args = arguments
    return this.giveCursorBack('findOne', args)
  }
  update () {
    var args = arguments
    return this.__collectionPromise.then(function (collection) {
      return collection.update.apply(collection, args)
    })
  }
  insert () {
    var args = arguments
    return this.__collectionPromise.then(function (collection) {
      return collection.insert.apply(collection, args)
    })
  }
}

module.exports = Model
