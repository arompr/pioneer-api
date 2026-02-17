import { InMemoryOutboxMessageMapper } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxMessageMapper';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { describe, expect, it } from 'vitest';

describe('InMemoryOutboxMessageMapper', () => {
    describe('toInMemory', () => {
        it('maps OutboxMessage to InMemoryOutboxMessage correctly', () => {
            const id = new OutboxMessageId('01JH9ABCDEFGHIJK');
            const eventType = 'PlayerJoinedLobby';
            const eventPayload = { playerId: 'player-456', info: 'something' };
            const createdAt = new Date('2024-01-01T00:00:00Z');
            const aggregateId = 'lobby-123';
            const message = new OutboxMessage(id, eventType, eventPayload, createdAt, aggregateId);

            const inMemoryMessage = InMemoryOutboxMessageMapper.toInMemory(message);

            expect(inMemoryMessage.id).toBe(id.value);
            expect(inMemoryMessage.eventType).toBe(eventType);
            expect(inMemoryMessage.eventPayload).toEqual(eventPayload);
            expect(inMemoryMessage.createdAt).toBe(createdAt);
            expect(inMemoryMessage.aggregateId).toBe(aggregateId);
        });
    });

    describe('toDomain', () => {
        it('maps InMemoryOutboxMessage to OutboxMessage correctly', () => {
            const id = new OutboxMessageId('01JH9ABCDEFGHIJK');
            const eventType = 'PlayerJoinedLobby';
            const eventPayload = { playerId: 'player-456', info: 'something' };
            const createdAt = new Date('2024-01-01T00:00:00Z');
            const aggregateId = 'lobby-123';
            const message = new OutboxMessage(id, eventType, eventPayload, createdAt, aggregateId);
            const imMessage = InMemoryOutboxMessageMapper.toInMemory(message);

            const reconstructedMessage = InMemoryOutboxMessageMapper.toDomain(imMessage);

            expect(reconstructedMessage.id.equals(message.id)).toBe(true);
            expect(reconstructedMessage.eventType).toBe(message.eventType);
            expect(reconstructedMessage.eventPayload).toEqual(message.eventPayload);
            expect(reconstructedMessage.createdAt).toBe(message.createdAt);
            expect(reconstructedMessage.aggregateId).toBe(message.aggregateId);
        });
    });
});
