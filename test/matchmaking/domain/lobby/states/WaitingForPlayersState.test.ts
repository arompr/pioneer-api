import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyNotReadyToStartError } from '#matchmaking/domain/lobby/errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '#matchmaking/domain/lobby/errors/PlayerIsNotHostError';
import { PlayerNotFoundInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerNotFoundInLobbyError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyJoinRules, LobbyStartRules } from '#matchmaking/domain/lobby/LobbyRules';

const joinRules = new LobbyJoinRules(2, 4);
const startRules = new LobbyStartRules(2);

let lobby: Lobby;
let player1: Player;
let player2: Player;

describe('WaitingForPlayersState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.baseLobby();
        lobby = l;
        [player1, player2] = players;
    });

    describe('join', () => {
        describe('when the lobby is not full', () => {
            it('adds the player in the lobby', () => {
                lobby.join(player2, joinRules);

                expect(lobby.playerCount).toBe(2);
            });
        });
    });

    describe('start', () => {
        describe('when the player attempting to start is the host', () => {
            it('throws LobbyNotReadyToStartError', () => {
                expect(() => {
                    lobby.start(player1.id, startRules);
                }).toThrow(LobbyNotReadyToStartError);
            });
        });

        describe('when the player attempting to start is not the host', () => {
            it('throws PlayerIsNotHostError', () => {
                expect(() => {
                    lobby.start(player2.id, startRules);
                }).toThrow(PlayerIsNotHostError);
            });
        });
    });

    describe('markAsReady', () => {
        describe('when the player is in the lobby', () => {
            it('contributes to the lobby becoming ready to start', () => {
                lobby.join(player2, joinRules);

                lobby.markAsReady(player1.id, startRules);
                lobby.markAsReady(player2.id, startRules);

                expect(lobby.canStart()).toBe(true);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsReady(player2.id, startRules);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsPending', () => {
        describe('when a player who was ready becomes pending again', () => {
            it('is no longer ready to start', () => {
                lobby.join(player2, joinRules);
                lobby.markAsReady(player1.id, startRules);
                lobby.markAsReady(player2.id, startRules);

                lobby.markAsPending(player1.id, startRules);

                expect(lobby.meetsRequirementsToStart(startRules)).toBe(false);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsPending(player2.id, startRules);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('canStart', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
