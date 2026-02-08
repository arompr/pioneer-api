import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '../Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import LobbyFullError from '../errors/LobbyFullError';
import LobbyNotReadyToStartError from '../errors/LobbyNotReadyToStartError';
import PlayerIsNotHostError from '../errors/PlayerIsNotHostError';
import PlayerNotFoundInLobbyError from '../errors/PlayerNotFoundInLobbyError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

let lobby: Lobby;
let player1: Player;
let player2: Player;
let player3: Player;
let player4: Player;

describe('WaitingForPlayersState', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.baseLobby();
        lobby = l;
        [player1, player2, player3, player4] = players;
    });

    describe('join()', () => {
        describe('when the lobby is not full', () => {
            it('adds the player in the lobby', () => {
                lobby.join(player2);

                expect(lobby.playerCount).toBe(2);
            });
        });

        describe('when the lobby is full', () => {
            it('throws LobbyFullError', () => {
                lobby.join(player2);
                lobby.join(player3);

                expect(() => {
                    lobby.join(player4);
                }).toThrow(LobbyFullError);
            });
        });
    });

    describe('start()', () => {
        describe('when the player attempting to start is the host', () => {
            it('throws LobbyNotReadyToStartError', () => {
                expect(() => {
                    lobby.start(player1.getSecretId());
                }).toThrow(LobbyNotReadyToStartError);
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
            it('contributes to the lobby becoming ready to start', () => {
                lobby.join(player2);

                lobby.markAsReady(player1.getSecretId());
                lobby.markAsReady(player2.getSecretId());

                expect(lobby.canStart()).toBe(true);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsReady(player2.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsPending()', () => {
        describe('when a player who was ready becomes pending again', () => {
            it('is no longer ready to start', () => {
                lobby.join(player2);
                lobby.markAsReady(player1.getSecretId());
                lobby.markAsReady(player2.getSecretId());

                lobby.markAsPending(player1.getSecretId());

                expect(lobby.meetsRequirementsToStart()).toBe(false);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsPending(player2.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('canStart()', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
