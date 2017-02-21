const WeaponSchema = require('./schemas/Weapon')
const CharacterSchema = require('./schemas/Character')
const Weapon = require('../models/Weapon')
const Character = require('../models/Character')
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const RootQuery = `
	type RootQuery {
		weapons: [Weapon]
		characters: [Character]
	}
`

const rootResolver = {
	RootQuery: {
		weapons () {
			return Weapon.find().toArray()
		},
		characters () {
			return Character.find().toArray()
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
