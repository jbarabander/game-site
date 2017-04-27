const Event = `
    enum EventType {
        dungeon
        bossFight
        cutscene
        default
    }
    type Event {
        _id: ID!
        name: String!
        eventType: EventType!
        eventDescription: String
        priorEvent: Event
    }
    type Events {
        events: [Event]
    }
`;

module.exports = Event;
