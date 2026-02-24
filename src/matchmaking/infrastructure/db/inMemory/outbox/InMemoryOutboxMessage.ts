/**
 * In-memory storage representation of an OutboxMessage.
 */
export class InMemoryOutboxMessage {
    constructor(
        public id: string,
        public eventType: string,
        public eventPayload: Record<string, unknown>,
        public createdAt: Date,
        public aggregateId: string
    ) {}
}
