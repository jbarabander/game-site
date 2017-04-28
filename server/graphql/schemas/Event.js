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
        characters: [Character]
    }
`;

module.exports = Event;
