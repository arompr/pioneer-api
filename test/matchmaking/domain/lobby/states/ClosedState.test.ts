import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyClosedError } from '#matchmaking/domain/lobby/errors/LobbyClosedError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyJoinRules, LobbyStartRules } from '#matchmaking/domain/lobby/LobbyRules';

const joinRules = new LobbyJoinRules(2, 4);
const startRules = new LobbyStartRules(2);

let lobby: Lobby;
let player1: Player;

describe('ClosedState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.inClosedLobby();
        lobby = l;
        [player1] = players;
    });

    describe('join', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.join(player1, joinRules);
            }).toThrow(LobbyClosedError);
        });
    });

    describe('start', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.start(player1.id, startRules);
            }).toThrow(LobbyClosedError);
        });
    });

    describe('markAsReady', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.markAsReady(player1.id, startRules);
            }).toThrow(LobbyClosedError);
        });
    });

    describe('markAsPending', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.markAsPending(player1.id, startRules);
            }).toThrow(LobbyClosedError);
        });
    });

    describe('canStart', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
