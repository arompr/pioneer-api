import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { TestOutboxMessageBuilder } from './TestOutboxMessageBuilder';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { EventPayload } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

/**
 * Test mother for OutboxMessage domain objects.
 */
export class OutboxMessageMother {
    /** Returns a PlayerJoinedLobby outbox message. */
    public static playerJoined(lobbyId = 'lobby-123', id?: OutboxMessageId): OutboxMessage {
        return new TestOutboxMessageBuilder()
            .withId(id ?? new OutboxMessageId('01JH9ABCDEFGHIJK'))
            .withEventType('PlayerJoinedLobby')
            .withEventPayload({ playerId: new PlayerId('player-123') })
            .withAggregateId(lobbyId)
            .build();
    }

    /** Returns a PlayerLeftLobby outbox message. */
    public static playerLeft(lobbyId = 'lobby-123', id?: OutboxMessageId): OutboxMessage {
        return new TestOutboxMessageBuilder()
            .withId(id ?? new OutboxMessageId('01JH9ABCDEFGHIJL'))
            .withEventType('PlayerLeftLobby')
            .withEventPayload({ playerId: new PlayerId('player-123'), wasHost: false })
            .withAggregateId(lobbyId)
            .build();
    }

    /** Returns a generic OutboxMessage with custom parameters. */
    public static any(
        params?: Partial<{
            id: OutboxMessageId;
            eventType: string;
            eventPayload: EventPayload;
            createdAt: Date;
            aggregateId: string;
        }>
    ): OutboxMessage {
        const builder = new TestOutboxMessageBuilder();
        if (params?.id) builder.withId(params.id);
        if (params?.eventType) builder.withEventType(params.eventType);
        if (params?.eventPayload) builder.withEventPayload(params.eventPayload);
        if (params?.createdAt) builder.withCreatedAt(params.createdAt);
        if (params?.aggregateId) builder.withAggregateId(params.aggregateId);
        return builder.build();
    }
}
