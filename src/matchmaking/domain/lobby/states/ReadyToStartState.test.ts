import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '../Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyFullError } from '../errors/LobbyFullError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { PlayerNotFoundInLobbyError } from '../errors/PlayerNotFoundInLobbyError';
import { LobbyAlreadyInGameError } from '../errors/LobbyAlreadyInGameError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

let lobby: Lobby;
let player1: Player;
let player2: Player;
let player3: Player;
let player4: Player;

describe('ReadyToStartState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.readyToStartLobby();
        lobby = l;
        [player1, player2, player3, player4] = players;
    });

    describe('join()', () => {
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

        describe('when the lobby is full', () => {
            it('throws LobbyFullError', () => {
                lobby.join(player3);

                expect(() => {
                    lobby.join(player4);
                }).toThrow(LobbyFullError);
            });
        });
    });

    describe('start()', () => {
        describe('when the player attempting to start is the host', () => {
            it('transitions to InGameState', () => {
                lobby.start(player1.getSecretId());

                expect(() => {
                    lobby.start(player1.getSecretId());
                }).toThrow(LobbyAlreadyInGameError);
            });
        });

        describe('when the player attempting to start is not the host', () => {
            it('throws PlayerIsNotHostError', () => {
                expect(() => {
                    lobby.start(player2.getSecretId());
                }).toThrow(PlayerIsNotHostError);
            });
        });
    });

    describe('markAsReady()', () => {
        describe('when the player is in the lobby', () => {
            it('mark the player as ready', () => {
                lobby.join(player3);

                lobby.markAsReady(player3.getSecretId());

                expect(lobby.readyPlayerCount).toBe(3);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsReady(player3.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsPending()', () => {
        describe('when a player who was ready becomes pending again', () => {
            it('is no longer ready to start', () => {
                lobby.markAsPending(player1.getSecretId());

                expect(lobby.canStart()).toBe(false);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsPending(player3.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('canStart()', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(true);
        });
    });
});
