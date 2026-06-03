import { LobbyDomainEventSerializer } from '#matchmaking/infrastructure/serializer/LobbyDomainEventSerializer';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyHostChanged } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { PlayerMarkedReady } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { PlayerMarkedPending } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { describe, expect, it, beforeEach } from 'vitest';

const playerId = new PlayerId('player-1');
const hostId = new PlayerId('host-1');

describe('LobbyDomainEventSerializer', () => {
    let serializer: LobbyDomainEventSerializer;

    beforeEach(() => {
        serializer = new LobbyDomainEventSerializer();
    });

    describe('serialize', () => {
        describe('when the event is PlayerJoinedLobby', () => {
            it('returns a payload with the playerId value', () => {
                const event = new PlayerJoinedLobby(playerId);

                const payload = serializer.serialize(event);

                expect(payload).toEqual({ playerId: 'player-1' });
            });
        });

        describe('when the event is PlayerLeftLobby', () => {
            describe('when the player was the host', () => {
                it('returns a payload with playerId and wasHost true', () => {
                    const event = new PlayerLeftLobby(playerId, true);

                    const payload = serializer.serialize(event);

                    expect(payload).toEqual({ playerId: 'player-1', wasHost: true });
                });
            });

            describe('when the player was not the host', () => {
                it('returns a payload with playerId and wasHost false', () => {
                    const event = new PlayerLeftLobby(playerId, false);

                    const payload = serializer.serialize(event);

                    expect(payload).toEqual({ playerId: 'player-1', wasHost: false });
                });
            });
        });

        describe('when the event is LobbyHostChanged', () => {
            it('returns a payload with the newHostId value', () => {
                const event = new LobbyHostChanged(hostId);

                const payload = serializer.serialize(event);

                expect(payload).toEqual({ newHostId: 'host-1' });
            });
        });

        describe('when the event is PlayerMarkedReady', () => {
            it('returns a payload with the playerId value', () => {
                const event = new PlayerMarkedReady(playerId);

                const payload = serializer.serialize(event);

                expect(payload).toEqual({ playerId: 'player-1' });
            });
        });

        describe('when the event is PlayerMarkedPending', () => {
            it('returns a payload with the playerId value', () => {
                const event = new PlayerMarkedPending(playerId);

                const payload = serializer.serialize(event);

                expect(payload).toEqual({ playerId: 'player-1' });
            });
        });

        describe('when the event is LobbyClosed', () => {
            it('returns an empty payload', () => {
                const event = new LobbyClosed();

                const payload = serializer.serialize(event);

                expect(payload).toEqual({});
            });
        });

        describe('when the event is LobbyStarted', () => {
            it('returns an empty payload', () => {
                const event = new LobbyStarted();

                const payload = serializer.serialize(event);

                expect(payload).toEqual({});
            });
        });

        describe('when the event type is unknown', () => {
            it('throws an error with the unknown type', () => {
                const event: DomainEvent = { type: 'UnknownEvent' };

                expect(() => serializer.serialize(event)).toThrow(
                    'Unknown domain event type: UnknownEvent'
                );
            });
        });
    });
});
