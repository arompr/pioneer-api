import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerIsNotHostError } from '#matchmaking/domain/lobby/errors/PlayerIsNotHostError';
import { PlayerNotFoundInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerNotFoundInLobbyError';
import { LobbyAlreadyInGameError } from '#matchmaking/domain/lobby/errors/LobbyAlreadyInGameError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

let lobby: Lobby;
let player1: Player;
let player2: Player;
let player3: Player;

describe('ReadyToStartState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.readyToStartLobby();
        lobby = l;
        [player1, player2, player3] = players;
    });

    describe('join', () => {
        describe('when the lobby is not full', () => {
            it('adds the player in the lobby', () => {
                lobby.join(player3);

                expect(lobby.playerCount).toBe(3);
            });

            it('transitions to WaitingForPlayers', () => {
                lobby.join(player3);

                expect(lobby.canStart()).toBe(false);
            });
        });
    });

    describe('start', () => {
        describe('when the player attempting to start is the host', () => {
            it('transitions to InGameState', () => {
                lobby.start(player1.id);

                expect(() => {
                    lobby.start(player1.id);
                }).toThrow(LobbyAlreadyInGameError);
            });
        });

        describe('when the player attempting to start is not the host', () => {
            it('throws PlayerIsNotHostError', () => {
                expect(() => {
                    lobby.start(player2.id);
                }).toThrow(PlayerIsNotHostError);
            });
        });
    });

    describe('markAsReady', () => {
        describe('when the player is in the lobby', () => {
            it('mark the player as ready', () => {
                lobby.join(player3);

                lobby.markAsReady(player3.id);

                expect(lobby.readyPlayerCount).toBe(3);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsReady(player3.id);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsPending', () => {
        describe('when a player who was ready becomes pending again', () => {
            it('is no longer ready to start', () => {
                lobby.markAsPending(player1.id);

                expect(lobby.canStart()).toBe(false);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsPending(player3.id);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('canStart', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(true);
        });
    });
});
