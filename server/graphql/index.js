const ObjectId = require('mongodb').ObjectId;
const Promise = require('bluebird');
// graphql schemas
const WeaponSchema = require('./schemas/Weapon');
const CharacterSchema = require('./schemas/Character');
const EventSchema = require('./schemas/Event');

// utils
const graphqlUtils = require('../utils/graphql');
const addToContext = graphqlUtils.addToContext;
const generateMongoHash = graphqlUtils.generateMongoHash;

// database models
const Weapon = require('../models/Weapon');
const Character = require('../models/Character');
const Event = require('../models/Event');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const RootQuery = `
    type RootQuery {
        weapons: [Weapon]
        weapon(id: ID): Weapon
        characters: [Character]
        character: Character
        events(limit: Int, expandPrior: Boolean): [Event]
        event(id: ID, expandPrior: Boolean): Event
    }
`;

function retrieveFromParentEvents(eventHash, priorEventsToFind) {
  const reducedPriorEventsToFind = [];
  const priorInCurrentEvents = {};
  priorEventsToFind.forEach((key) => {
    const stringKey = key.toString();
    if (eventHash[stringKey]) {
      priorInCurrentEvents[stringKey] = eventHash[stringKey];
    } else {
      reducedPriorEventsToFind.push(key);
    }
  });
  if (!reducedPriorEventsToFind.length) {
    return Promise.resolve(priorInCurrentEvents);
  }
  return Event
  .find({ _id: { $in: reducedPriorEventsToFind } })
  .toArray()
  .then((events) => {
    const priorEventsFromDb = generateMongoHash(events);
    return Object.assign(priorInCurrentEvents, priorEventsFromDb);
  });
}

function retrieveCharactersFromEvents(eventHash) {
  const eventKeys = Object.keys(eventHash);
  const charactersToFind = eventKeys.reduce((prev, curr) => {
    if (eventHash[curr] && Array.isArray(eventHash[curr].characters)) {
      return prev.concat(eventHash[curr].characters);
    }
    return prev;
  }, []);
  return Character
    .find({ _id: { $in: charactersToFind } })
    .toArray()
    .then((characters) => generateMongoHash(characters));
}

const rootResolver = {
  RootQuery: {
    weapons() {
      return Weapon.find().toArray();
    },
    characters() {
      return Character.find().toArray();
    },
    events(_, { limit, expandPrior }, context, info) {
      const opts = {};
      if (limit) {
        opts.limit = limit;
      }
      return Event.find({}, opts).toArray().then((events) => {
        addToContext(generateMongoHash(events), context, info);
        if (expandPrior) {
          // eslint-disable-next-line
          context.priorEvents = [];
          events.forEach((event) => {
            if (event.priorEvent) {
              context.priorEvents.push(event.priorEvent);
            }
          });
        }
        return events;
      });
    },
    event(_, { id, expandPrior }, context) {
      const boolExpandPrior = !!expandPrior;
      if (!id) {
        throw Error('No ID specified');
      }
      // eslint-disable-next-line
      context.expandPrior = boolExpandPrior;
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
    priorEvent({ priorEvent }, args, context) {
      if (priorEvent) {
        if (context.events && Array.isArray(context.priorEvents)) {
          if (!context.priorEventsPromise) {
            context.priorEventsPromise = retrieveFromParentEvents(context.events, context.priorEvents);
          }
          return context
          .priorEventsPromise
          .then((priorEventsHash) => (priorEventsHash[priorEvent.toString()]));
        }
        if (context.expandPrior) {
          return Event.findOne({ _id: priorEvent });
        }
      }
      return null;
    },
    characters({ characters }, args, context) {
      if (!Array.isArray(characters)) {
        return null;
      }
      if (context.events) {
        if (!context.eventCharactersPromise) {
          context.eventCharactersPromise = retrieveCharactersFromEvents(context.events);
        }
        return context.eventCharactersPromise
        .then((charactersHash) => characters.map((id) => charactersHash[id.toString()]));
      }
      return Character.find({ _id: { $in: characters } }).toArray();
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
