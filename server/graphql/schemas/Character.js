const Character = `
	enum Class {
		mage
		priest
		warrior
		berserker
	}
	enum Race {
		human
		dwarf
		elf
	}
	type SpellEntry {
		level: Int!,
		spell: ID!
	}
	type Character {
		_id: ID!
		name: String!
		class: Class!
		race: Race!
		spells: [SpellEntry]
		imageUrl: String
		characterDescription: String
	}
`

module.exports = Character