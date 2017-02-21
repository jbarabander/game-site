const WeaponSchema = require('./schemas/Weapon')
const CharacterSchema = require('./schemas/Character')
const Weapon = require('../models/Weapon')
const Character = require('../models/Character')
const ObjectId = require('mongodb').ObjectId
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const RootQuery = `
	type RootQuery {
		weapons: [Weapon]
		weapon(id: ID): Weapon
		characters: [Character]
		character: Character
	}
`

const rootResolver = {
	RootQuery: {
		weapons () {
			return Weapon.find().toArray()
		},
		characters () {
			return Character.find().toArray()
		},
		weapon (_, { id }) {
			if (!id) {
				throw Error('No ID specified')
			}
			return Weapon.findOne({_id: ObjectId(id)})
		},
		character (_, { id }) {
			if (!id) {
				throw Error('No ID specified')
			}
			return Character.findOne({_id: ObjectId(id)})
		}
	}
}

const SchemaDef = `
	schema {
		query: RootQuery
	}
`



const jsSchema = makeExecutableSchema({
	typeDefs: [SchemaDef, RootQuery, WeaponSchema, CharacterSchema],
	resolvers: rootResolver
})

module.exports = jsSchema
