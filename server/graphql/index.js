const WeaponSchema = require('./schemas/Weapon');
const CharacterSchema = require('./schemas/Character');
const EventSchema = require('./schemas/Event');
const Weapon = require('../models/Weapon');
const Character = require('../models/Character');
const Event = require('../models/Event');
const ObjectId = require('mongodb').ObjectId;
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const RootQuery = `
    type RootQuery {
        weapons: [Weapon]
        weapon(id: ID): Weapon
        characters: [Character]
        character: Character
        events(limit: Int): [Event]
        event(id: ID): Event
    }
`;

const rootResolver = {
  RootQuery: {
    weapons() {
      return Weapon.find().toArray();
    },
    characters() {
      return Character.find().toArray();
    },
    events(_, { limit }) {
      const eventQuery = Event.find();
      if (limit) {
        eventQuery.limit(limit);
      }
      return eventQuery.toArray();
    },
    event(_, { id }) {
      if (!id) {
        throw Error('No ID specified');
      }
      return Event.findOne({ _id: ObjectId(id) });
    },
    weapon(_, { id }) {
      if (!id) {
        throw Error('No ID specified');
      }
      return Weapon.findOne({ _id: ObjectId(id) });
    },
    character(_, { id }) {
      if (!id) {
        throw Error('No ID specified');
      }
      return Character.findOne({ _id: ObjectId(id) });
    },
  },
  Event: {
    priorEvent({ priorEvent }, args, context, info) {
      console.log(info);
      console.log(info.path.prev.prev.key);
      if (priorEvent) {
        return Event.findOne(priorEvent);
      }
      return null;
    },
  },
};

const SchemaDef = `
    schema {
        query: RootQuery
    }
`;


const jsSchema = makeExecutableSchema({
  typeDefs: [SchemaDef, RootQuery, WeaponSchema, CharacterSchema, EventSchema],
  resolvers: rootResolver,
});

module.exports = jsSchema;
