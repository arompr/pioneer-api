import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '../Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyClosedError } from '../errors/LobbyClosedError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

let lobby: Lobby;
let player1: Player;

describe('ClosedState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.inClosedLobby();
        lobby = l;
        [player1] = players;
    });

    describe('join()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.join(player1);
            }).toThrow(LobbyClosedError);
        });
    });

    describe('start()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.start(player1.getSecretId());
            }).toThrow(LobbyClosedError);
        });
    });

    describe('markAsReady()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.markAsReady(player1.getSecretId());
            }).toThrow(LobbyClosedError);
        });
    });

    describe('markAsPending()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.markAsPending(player1.getSecretId());
            }).toThrow(LobbyClosedError);
        });
    });

    describe('canStart()', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
