import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyNotReadyToStartError } from '#matchmaking/domain/lobby/errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '#matchmaking/domain/lobby/errors/PlayerIsNotHostError';
import { PlayerNotFoundInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerNotFoundInLobbyError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyGameConfig } from '#matchmaking/domain/lobby/LobbyGameConfig';

const config = new LobbyGameConfig(2, 4);

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
                lobby.join(player2, config);

                expect(lobby.playerCount).toBe(2);
            });
        });
    });

    describe('start', () => {
        describe('when the player attempting to start is the host', () => {
            it('throws LobbyNotReadyToStartError', () => {
                expect(() => {
                    lobby.start(player1.id, config);
                }).toThrow(LobbyNotReadyToStartError);
            });
        });

        describe('when the player attempting to start is not the host', () => {
            it('throws PlayerIsNotHostError', () => {
                expect(() => {
                    lobby.start(player2.id, config);
                }).toThrow(PlayerIsNotHostError);
            });
        });
    });

    describe('markAsReady', () => {
        describe('when the player is in the lobby', () => {
            it('contributes to the lobby becoming ready to start', () => {
                lobby.join(player2, config);

                lobby.markAsReady(player1.id, config);
                lobby.markAsReady(player2.id, config);

                expect(lobby.canStart()).toBe(true);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsReady(player2.id, config);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsPending', () => {
        describe('when a player who was ready becomes pending again', () => {
            it('is no longer ready to start', () => {
                lobby.join(player2, config);
                lobby.markAsReady(player1.id, config);
                lobby.markAsReady(player2.id, config);

                lobby.markAsPending(player1.id, config);

                expect(lobby.meetsRequirementsToStart(config)).toBe(false);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsPending(player2.id, config);
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
