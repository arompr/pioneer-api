import { InMemoryOutboxMessageEventMapper } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import {
    LobbyClosedUseCaseEvent,
    LobbyHostChangedUseCaseEvent,
    LobbyStartedUseCaseEvent,
    PlayerJoinedLobbyUseCaseEvent,
    PlayerLeftLobbyUseCaseEvent,
    PlayerMarkedPendingUseCaseEvent,
    PlayerMarkedReadyUseCaseEvent,
} from '#matchmaking/usecase/events';
import { describe, expect, it } from 'vitest';

const id = new OutboxMessageId('01JH9ABCDEFGHIJK');
const aggregateId = 'lobby-123';
const createdAt = new Date('2024-01-01T00:00:00Z');

function makeMessage(eventType: string, eventPayload: Record<string, unknown>): OutboxMessage {
    return new OutboxMessage(id, eventType, eventPayload, createdAt, aggregateId);
}

describe('InMemoryOutboxMessageEventMapper', () => {
    describe('toUseCaseEvent', () => {
        describe('when the event type is PlayerJoinedLobby', () => {
            it('returns a PlayerJoinedLobbyUseCaseEvent with the correct lobbyId and playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerJoinedLobby.value, {
                    playerId: 'player-1',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerJoinedLobbyUseCaseEvent);
                expect((event as PlayerJoinedLobbyUseCaseEvent).lobbyId.value).toBe(aggregateId);
                expect((event as PlayerJoinedLobbyUseCaseEvent).payload.playerId).toBe('player-1');
            });
        });

        describe('when the event type is PlayerLeftLobby', () => {
            it('returns a PlayerLeftLobbyUseCaseEvent with the correct lobbyId, playerId and wasHost', () => {
                const message = makeMessage(LobbyEventType.PlayerLeftLobby.value, {
                    playerId: 'player-2',
                    wasHost: true,
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerLeftLobbyUseCaseEvent);
                expect((event as PlayerLeftLobbyUseCaseEvent).lobbyId.value).toBe(aggregateId);
                expect((event as PlayerLeftLobbyUseCaseEvent).payload.playerId).toBe('player-2');
                expect((event as PlayerLeftLobbyUseCaseEvent).payload.wasHost).toBe(true);
            });
        });

        describe('when the event type is LobbyClosed', () => {
            it('returns a LobbyClosedUseCaseEvent with the correct lobbyId', () => {
                const message = makeMessage(LobbyEventType.LobbyClosed.value, {});

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(LobbyClosedUseCaseEvent);
                expect((event as LobbyClosedUseCaseEvent).lobbyId.value).toBe(aggregateId);
            });
        });

        describe('when the event type is LobbyHostChanged', () => {
            it('returns a LobbyHostChangedUseCaseEvent with the correct lobbyId and newHostId', () => {
                const message = makeMessage(LobbyEventType.LobbyHostChanged.value, {
                    newHostId: 'player-3',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(LobbyHostChangedUseCaseEvent);
                expect((event as LobbyHostChangedUseCaseEvent).lobbyId.value).toBe(aggregateId);
                expect((event as LobbyHostChangedUseCaseEvent).payload.newHostId).toBe('player-3');
            });
        });

        describe('when the event type is LobbyStarted', () => {
            it('returns a LobbyStartedUseCaseEvent with the correct lobbyId', () => {
                const message = makeMessage(LobbyEventType.LobbyStarted.value, {});

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(LobbyStartedUseCaseEvent);
                expect((event as LobbyStartedUseCaseEvent).lobbyId.value).toBe(aggregateId);
            });
        });

        describe('when the event type is PlayerMarkedPending', () => {
            it('returns a PlayerMarkedPendingUseCaseEvent with the correct lobbyId and playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerMarkedPending.value, {
                    playerId: 'player-4',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerMarkedPendingUseCaseEvent);
                expect((event as PlayerMarkedPendingUseCaseEvent).lobbyId.value).toBe(aggregateId);
                expect((event as PlayerMarkedPendingUseCaseEvent).payload.playerId).toBe(
                    'player-4'
                );
            });
        });

        describe('when the event type is PlayerMarkedReady', () => {
            it('returns a PlayerMarkedReadyUseCaseEvent with the correct lobbyId and playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerMarkedReady.value, {
                    playerId: 'player-5',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerMarkedReadyUseCaseEvent);
                expect((event as PlayerMarkedReadyUseCaseEvent).lobbyId.value).toBe(aggregateId);
                expect((event as PlayerMarkedReadyUseCaseEvent).payload.playerId).toBe('player-5');
            });
        });

        describe('when the event type is unrecognised', () => {
            it('returns a plain object with type and payload', () => {
                const payload = { someField: 'someValue' };
                const message = makeMessage('UnknownEventType', payload);

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toEqual({ type: 'UnknownEventType', payload });
            });
        });
    });
});
