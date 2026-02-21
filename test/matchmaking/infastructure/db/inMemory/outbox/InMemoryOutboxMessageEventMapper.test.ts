import { InMemoryOutboxMessageEventMapper } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyHostChanged } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { PlayerMarkedPending } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
import { PlayerMarkedReady } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { describe, expect, it } from 'vitest';

const id = new OutboxMessageId('01JH9ABCDEFGHIJK');
const aggregateId = 'lobby-123';
const createdAt = new Date('2024-01-01T00:00:00Z');

function makeMessage(eventType: string, eventPayload: Record<string, unknown>): OutboxMessage {
    return new OutboxMessage(id, eventType, eventPayload, createdAt, aggregateId);
}

describe('InMemoryOutboxMessageEventMapper', () => {
    describe('toDomainEvent', () => {
        describe('when the event type is PlayerJoinedLobby', () => {
            it('returns a PlayerJoinedLobby instance with the correct playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerJoinedLobby.value, {
                    playerId: 'player-1',
                });

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(PlayerJoinedLobby);
                expect((event as PlayerJoinedLobby).payload.playerId).toBe('player-1');
            });
        });

        describe('when the event type is PlayerLeftLobby', () => {
            it('returns a PlayerLeftLobby instance with the correct playerId and wasHost', () => {
                const message = makeMessage(LobbyEventType.PlayerLeftLobby.value, {
                    playerId: 'player-2',
                    wasHost: true,
                });

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(PlayerLeftLobby);
                expect((event as PlayerLeftLobby).payload.playerId).toBe('player-2');
                expect((event as PlayerLeftLobby).payload.wasHost).toBe(true);
            });
        });

        describe('when the event type is LobbyClosed', () => {
            it('returns a LobbyClosed instance', () => {
                const message = makeMessage(LobbyEventType.LobbyClosed.value, {});

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(LobbyClosed);
            });
        });

        describe('when the event type is LobbyHostChanged', () => {
            it('returns a LobbyHostChanged instance with the correct newHostId', () => {
                const message = makeMessage(LobbyEventType.LobbyHostChanged.value, {
                    newHostId: 'player-3',
                });

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(LobbyHostChanged);
                expect((event as LobbyHostChanged).payload.newHostId).toBe('player-3');
            });
        });

        describe('when the event type is LobbyStarted', () => {
            it('returns a LobbyStarted instance', () => {
                const message = makeMessage(LobbyEventType.LobbyStarted.value, {});

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(LobbyStarted);
            });
        });

        describe('when the event type is PlayerMarkedPending', () => {
            it('returns a PlayerMarkedPending instance with the correct playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerMarkedPending.value, {
                    playerId: 'player-4',
                });

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(PlayerMarkedPending);
                expect((event as PlayerMarkedPending).payload.playerId).toBe('player-4');
            });
        });

        describe('when the event type is PlayerMarkedReady', () => {
            it('returns a PlayerMarkedReady instance with the correct playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerMarkedReady.value, {
                    playerId: 'player-5',
                });

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toBeInstanceOf(PlayerMarkedReady);
                expect((event as PlayerMarkedReady).payload.playerId).toBe('player-5');
            });
        });

        describe('when the event type is unrecognised', () => {
            it('returns a plain object with type and payload', () => {
                const payload = { someField: 'someValue' };
                const message = makeMessage('UnknownEventType', payload);

                const event = InMemoryOutboxMessageEventMapper.toDomainEvent(message);

                expect(event).toEqual({ type: 'UnknownEventType', payload });
            });
        });
    });
});
