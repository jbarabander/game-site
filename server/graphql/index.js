const ObjectId = require('mongodb').ObjectId;
const Promise = require('bluebird');
// graphql schemas
const WeaponSchema = require('./schemas/Weapon');
const CharacterSchema = require('./schemas/Character');
const EventSchema = require('./schemas/Event');

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
  return Event.find({ $in: reducedPriorEventsToFind }).then((events) => {
    const priorEventsFromDb = events.reduce((prev, curr) => {
      if (curr._id) {
        prev[curr._id.toString()] = curr;
      }
      return prev;
    }, {});
    return Object.assign(priorInCurrentEvents, priorEventsFromDb);
  });
}

const rootResolver = {
  RootQuery: {
    weapons() {
      return Weapon.find().toArray();
    },
    characters() {
      return Character.find().toArray();
    },
    events(_, { limit, expandPrior }, context) {
      const opts = {};
      if (limit) {
        opts.limit = limit;
      }
      return Event.find({}, opts).toArray().then((events) => {
        if (expandPrior) {
          // eslint-disable-next-line
          context.events = {};
          // eslint-disable-next-line
          context.priorEvents = [];
          events.forEach((event) => {
            if (event.priorEvent) {
              context.priorEvents.push(event.priorEvent);
            }
            if (event._id) {
              // eslint-disable-next-line
              context.events[event._id.toString()] = event;
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
