import { InMemoryOutboxMessageEventMapper } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper';
import { LobbyClosedUseCaseEvent } from '#matchmaking/usecase/events/LobbyClosedUseCaseEvent';
import { LobbyHostChangedUseCaseEvent } from '#matchmaking/usecase/events/LobbyHostChangedUseCaseEvent';
import { LobbyStartedUseCaseEvent } from '#matchmaking/usecase/events/LobbyStartedUseCaseEvent';
import { PlayerJoinedLobbyUseCaseEvent } from '#matchmaking/usecase/events/PlayerJoinedLobbyUseCaseEvent';
import { PlayerLeftLobbyUseCaseEvent } from '#matchmaking/usecase/events/PlayerLeftLobbyUseCaseEvent';
import { PlayerMarkedPendingUseCaseEvent } from '#matchmaking/usecase/events/PlayerMarkedPendingUseCaseEvent';
import { PlayerMarkedReadyUseCaseEvent } from '#matchmaking/usecase/events/PlayerMarkedReadyUseCaseEvent';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { ZodError } from 'zod';
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
                const message = makeMessage(LobbyEventType.PlayerJoinedLobby, {
                    playerId: 'player-1',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerJoinedLobbyUseCaseEvent);
                const joined = event as PlayerJoinedLobbyUseCaseEvent;
                expect(joined.lobbyId.value).toBe(aggregateId);
                expect(joined.playerId.value).toBe('player-1');
            });
        });

        describe('when the event type is PlayerLeftLobby', () => {
            it('returns a PlayerLeftLobbyUseCaseEvent with the correct lobbyId, playerId and wasHost', () => {
                const message = makeMessage(LobbyEventType.PlayerLeftLobby, {
                    playerId: 'player-2',
                    wasHost: true,
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerLeftLobbyUseCaseEvent);
                const left = event as PlayerLeftLobbyUseCaseEvent;
                expect(left.lobbyId.value).toBe(aggregateId);
                expect(left.playerId.value).toBe('player-2');
                expect(left.wasHost).toBe(true);
            });
        });

        describe('when the event type is LobbyClosed', () => {
            it('returns a LobbyClosedUseCaseEvent with the correct lobbyId', () => {
                const message = makeMessage(LobbyEventType.LobbyClosed, {});

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(LobbyClosedUseCaseEvent);
                const closed = event as LobbyClosedUseCaseEvent;
                expect(closed.lobbyId.value).toBe(aggregateId);
            });
        });

        describe('when the event type is LobbyHostChanged', () => {
            it('returns a LobbyHostChangedUseCaseEvent with the correct lobbyId and newHostId', () => {
                const message = makeMessage(LobbyEventType.LobbyHostChanged, {
                    newHostId: 'player-3',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(LobbyHostChangedUseCaseEvent);
                const hostChanged = event as LobbyHostChangedUseCaseEvent;
                expect(hostChanged.lobbyId.value).toBe(aggregateId);
                expect(hostChanged.newHostId.value).toBe('player-3');
            });
        });

        describe('when the event type is LobbyStarted', () => {
            it('returns a LobbyStartedUseCaseEvent with the correct lobbyId', () => {
                const message = makeMessage(LobbyEventType.LobbyStarted, {});

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(LobbyStartedUseCaseEvent);
                const started = event as LobbyStartedUseCaseEvent;
                expect(started.lobbyId.value).toBe(aggregateId);
            });
        });

        describe('when the event type is PlayerMarkedPending', () => {
            it('returns a PlayerMarkedPendingUseCaseEvent with the correct lobbyId and playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerMarkedPending, {
                    playerId: 'player-4',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerMarkedPendingUseCaseEvent);
                const pending = event as PlayerMarkedPendingUseCaseEvent;
                expect(pending.lobbyId.value).toBe(aggregateId);
                expect(pending.playerId.value).toBe('player-4');
            });
        });

        describe('when the event type is PlayerMarkedReady', () => {
            it('returns a PlayerMarkedReadyUseCaseEvent with the correct lobbyId and playerId', () => {
                const message = makeMessage(LobbyEventType.PlayerMarkedReady, {
                    playerId: 'player-5',
                });

                const event = InMemoryOutboxMessageEventMapper.toUseCaseEvent(message);

                expect(event).toBeInstanceOf(PlayerMarkedReadyUseCaseEvent);
                const ready = event as PlayerMarkedReadyUseCaseEvent;
                expect(ready.lobbyId.value).toBe(aggregateId);
                expect(ready.playerId.value).toBe('player-5');
            });
        });

        describe('when the event type is unrecognised', () => {
            it('throws an error', () => {
                const message = makeMessage('UnknownEventType', { someField: 'someValue' });

                expect(() => InMemoryOutboxMessageEventMapper.toUseCaseEvent(message)).toThrow(
                    'Unknown event type: UnknownEventType'
                );
            });
        });

        describe('when the payload is malformed', () => {
            describe('when playerId is missing for PlayerJoinedLobby', () => {
                it('throws a ZodError', () => {
                    const message = makeMessage(LobbyEventType.PlayerJoinedLobby, {
                        wrongField: 'value',
                    });

                    expect(() => InMemoryOutboxMessageEventMapper.toUseCaseEvent(message)).toThrow(
                        ZodError
                    );
                });
            });

            describe('when playerId is the wrong type for PlayerJoinedLobby', () => {
                it('throws a ZodError', () => {
                    const message = makeMessage(LobbyEventType.PlayerJoinedLobby, {
                        playerId: 42,
                    });

                    expect(() => InMemoryOutboxMessageEventMapper.toUseCaseEvent(message)).toThrow(
                        ZodError
                    );
                });
            });

            describe('when wasHost is missing for PlayerLeftLobby', () => {
                it('throws a ZodError', () => {
                    const message = makeMessage(LobbyEventType.PlayerLeftLobby, {
                        playerId: 'player-1',
                    });

                    expect(() => InMemoryOutboxMessageEventMapper.toUseCaseEvent(message)).toThrow(
                        ZodError
                    );
                });
            });

            describe('when newHostId is missing for LobbyHostChanged', () => {
                it('throws a ZodError', () => {
                    const message = makeMessage(LobbyEventType.LobbyHostChanged, {});

                    expect(() => InMemoryOutboxMessageEventMapper.toUseCaseEvent(message)).toThrow(
                        ZodError
                    );
                });
            });
        });
    });
});
