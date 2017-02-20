var db = require('../db')
var weaponSchema = {
	$schema: 'http://json-schema.org/draft-04/schema#',
	type: 'object',
	properties: {
		name: {type: 'string'},
		weaponType: {
			enum: [
			'staffs',
			'swords',
			'axes',
			'hammers',
			'tomes'
			]
		},
		attack: {type: 'number'},
		imageUrl: {type: 'string'},
		weaponDescription: {type: 'string'}
	},
	required: ['name', 'weaponType', 'attack']
}

const Weapon = `
	enum WeaponType {
		staffs
		swords
		axes
		hammers
		tomes
	}

	type Weapon {
		_id: ID!
		name: String!
		weaponType: WeaponType!
		attack: Int!
		imageUrl: String
		weaponDescription: String
	}
`

module.exports = Weapon


