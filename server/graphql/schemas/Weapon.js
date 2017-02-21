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


