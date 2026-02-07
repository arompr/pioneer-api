import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '../Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyAlreadyInGameError } from '../errors/LobbyAlreadyInGameError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

let lobby: Lobby;
let player1: Player;

describe('InGameState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.inGameLobby();
        lobby = l;
        [player1] = players;
    });

    describe('join()', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.join(player1);
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('start()', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.start(player1.getSecretId());
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('markAsReady()', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.markAsReady(player1.getSecretId());
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('markAsPending()', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.markAsPending(player1.getSecretId());
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('canStart()', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
