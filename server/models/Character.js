var db = require('../db')
var characterSchema = {
	$schema: 'http://json-schema.org/draft-04/schema#',
	type: 'object',
	properties: {
		name: {type: 'string'},
		race: {
			enum: [
			'human',
			'dwarf',
			'elf'
			]
		},
		class: {
			enum: [
			'mage',
			'priest',
			'warrior',
			'berserker'
			]
		},
		spells: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					level: {type: 'number'},
					spell: {type: 'string'}
				}
			}
		},
		imageUrl: {type: 'string'},
		characterDescription: {type: 'string'}
	},
	required: ['name', 'race', 'class']
}

module.exports = db.model('characters', characterSchema)
