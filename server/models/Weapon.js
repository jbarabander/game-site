module.exports = {
	$schema: 'http://json-schema.org/draft-04/schema#',
	name: 'string',
	weaponType: {
		enum: [
		'staffs',
		'swords',
		'axes',
		'hammers',
		'tomes'
		]
	},
	attack: 'number',
	imageUrl: 'string',
	weaponDescription: 'string',
	required: ['name', 'weaponType', 'attack']
}