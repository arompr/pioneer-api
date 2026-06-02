import { describe, expect, it } from 'vitest';
import { LobbyDomainEventDeserializer } from '#matchmaking/infrastructure/serializer/LobbyDomainEventDeserializer';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyHostChanged } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerMarkedReady } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { PlayerMarkedPending } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

const aggregateId = new LobbyId('lobby-123');
const deserializer = new LobbyDomainEventDeserializer();

describe('LobbyDomainEventDeserializer', () => {
    describe('deserialize', () => {
        describe('when deserializing PlayerJoinedLobby', () => {
            it('reconstructs the domain event with typed value objects', () => {
                const payload = { playerId: 'player-1' };

                const event = deserializer.deserialize('PlayerJoinedLobby', aggregateId, payload);

                expect(event).toBeInstanceOf(PlayerJoinedLobby);
                const typed = event as PlayerJoinedLobby;
                expect(typed.playerId).toBeInstanceOf(PlayerId);
                expect(typed.playerId.value).toBe('player-1');
            });
        });

        describe('when deserializing PlayerLeftLobby', () => {
            it('reconstructs the domain event with typed value objects', () => {
                const payload = { playerId: 'player-1', wasHost: true };

                const event = deserializer.deserialize('PlayerLeftLobby', aggregateId, payload);

                expect(event).toBeInstanceOf(PlayerLeftLobby);
                const typed = event as PlayerLeftLobby;
                expect(typed.playerId.value).toBe('player-1');
                expect(typed.wasHost).toBe(true);
            });
        });

        describe('when deserializing LobbyHostChanged', () => {
            it('reconstructs the domain event with typed value objects', () => {
                const payload = { newHostId: 'player-2' };

                const event = deserializer.deserialize('LobbyHostChanged', aggregateId, payload);

                expect(event).toBeInstanceOf(LobbyHostChanged);
                const typed = event as LobbyHostChanged;
                expect(typed.newHostId.value).toBe('player-2');
            });
        });

        describe('when deserializing LobbyClosed', () => {
            it('reconstructs the empty domain event', () => {
                const event = deserializer.deserialize('LobbyClosed', aggregateId, {});

                expect(event).toBeInstanceOf(LobbyClosed);
            });
        });

        describe('when deserializing LobbyStarted', () => {
            it('reconstructs the empty domain event', () => {
                const event = deserializer.deserialize('LobbyStarted', aggregateId, {});

                expect(event).toBeInstanceOf(LobbyStarted);
            });
        });

        describe('when deserializing PlayerMarkedReady', () => {
            it('reconstructs the domain event with typed value objects', () => {
                const payload = { playerId: 'player-1' };

                const event = deserializer.deserialize('PlayerMarkedReady', aggregateId, payload);

                expect(event).toBeInstanceOf(PlayerMarkedReady);
                const typed = event as PlayerMarkedReady;
                expect(typed.playerId.value).toBe('player-1');
            });
        });

        describe('when deserializing PlayerMarkedPending', () => {
            it('reconstructs the domain event with typed value objects', () => {
                const payload = { playerId: 'player-1' };

                const event = deserializer.deserialize('PlayerMarkedPending', aggregateId, payload);

                expect(event).toBeInstanceOf(PlayerMarkedPending);
                const typed = event as PlayerMarkedPending;
                expect(typed.playerId.value).toBe('player-1');
            });
        });

        describe('when the event type is unknown', () => {
            it('throws an error', () => {
                expect(() => deserializer.deserialize('UnknownEvent', aggregateId, {})).toThrow(
                    'Unknown domain event type: UnknownEvent'
                );
            });
        });

        describe('when the payload is malformed', () => {
            it('throws a ZodError for missing required fields', () => {
                expect(() =>
                    deserializer.deserialize('PlayerJoinedLobby', aggregateId, { wrongField: 'x' })
                ).toThrow();
            });
        });
    });
});
