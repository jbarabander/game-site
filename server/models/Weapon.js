module.exports = {
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