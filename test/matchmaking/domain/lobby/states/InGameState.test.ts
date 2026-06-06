import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyAlreadyInGameError } from '#matchmaking/domain/lobby/errors/LobbyAlreadyInGameError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyJoinRules, LobbyStartRules } from '#matchmaking/domain/lobby/LobbyRules';

const joinRules = new LobbyJoinRules(2, 4);
const startRules = new LobbyStartRules(2);

let lobby: Lobby;
let player1: Player;

describe('InGameState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.inGameLobby();
        lobby = l;
        [player1] = players;
    });

    describe('join', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.join(player1, joinRules);
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('start', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.start(player1.id, startRules);
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('markAsReady', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.markAsReady(player1.id, startRules);
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('markAsPending', () => {
        it('throws LobbyAlreadyInGameError', () => {
            expect(() => {
                lobby.markAsPending(player1.id, startRules);
            }).toThrow(LobbyAlreadyInGameError);
        });
    });

    describe('canStart', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
