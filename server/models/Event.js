const db = require('../db');
const eventSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    name: { type: 'string' },
    eventType: {
      enum: [
        'dungeon',
        'bossFight',
        'cutscene',
        'default',
      ],
    },
    eventDescription: { type: 'string' },
    priorEvent: { $ref: 'objectId' },
  },
  required: ['name', 'eventType', 'eventDescription'],
};

module.exports = db.model('events', eventSchema);
