import { beforeEach, describe, expect, it } from 'vitest';
import { LobbyId } from './lobbyId/LobbyId.ts';
import { Lobby } from './Lobby.ts';
import { LobbyConfig } from './LobbyConfig/LobbyConfig.ts';
import { LobbyGameMode } from './LobbyConfig/LobbyGameMode.ts';
import { LobbyStatus } from './LobbyStatus.ts';
import { Player } from '../player/Player.ts';
import { PlayerId } from '../player/playerId/PlayerId.ts';
import { LobbyFullError } from './errors/LobbyFullError.ts';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError.ts';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError.ts';

const LOBBY_ID = new LobbyId('lobby-id');
const LOBBY_CONFIG = new LobbyConfig(LobbyGameMode.BASE, 2, 3);
let lobby: Lobby;

const player1 = new Player(new PlayerId('p1-secret'), new PlayerId('p1-publbic'), 'Player 1');
const player2 = new Player(new PlayerId('p2-secret'), new PlayerId('p2-publbic'), 'Player 2');
const player3 = new Player(new PlayerId('p3-secret'), new PlayerId('p3-publbic'), 'Player 3');
const player4 = new Player(new PlayerId('p4-secret'), new PlayerId('p4-publbic'), 'Player 4');

describe('Lobby', () => {
    beforeEach(() => {
        lobby = new Lobby(LOBBY_ID, LOBBY_CONFIG);
    });

    describe('creation', () => {
        describe('when Lobby is created', () => {
            it('is empty', () => {
                expect(lobby.isEmpty()).toBe(true);
                expect(lobby.playerCount).toBe(0);
            });

            it('has the provided ID', () => {
                expect(lobby.getId()).toBe(LOBBY_ID);
            });

            it('is in WAITING_FOR_PLAYERS status', () => {
                expect(lobby.status).toBe(LobbyStatus.WAITING_FOR_PLAYERS);
            });
        });
    });

    describe('join()', () => {
        describe('when the lobby is not full', () => {
            it('adds the player in the lobby', () => {
                lobby.join(player1);

                expect(lobby.playerCount).toBe(1);
                expect(lobby.allPlayers).toContain(player1);
            });
        });

        describe('when the lobby if full ', () => {
            it('throws LobbyFullError', () => {
                lobby.join(player1);
                lobby.join(player2);
                lobby.join(player3);

                expect(() => {
                    lobby.join(player4);
                }).toThrow(LobbyFullError);
            });
        });

        describe('when the player in already in the lobby', () => {
            it('throws PlayerAlreadyInLobbyError', () => {
                lobby.join(player1);

                expect(() => {
                    lobby.join(player1);
                }).toThrow(PlayerAlreadyInLobbyError);
            });
        });
    });

    describe('leave()', () => {
        describe('when the player is in the lobby', () => {
            it('removes the player from the lobby', () => {
                lobby.join(player1);

                lobby.leave(player1.getSecretId());

                expect(lobby.isEmpty()).toBe(true);
                expect(lobby.playerCount).toBe(0);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.leave(player1.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });

        describe('when the host leaves', () => {
            it('transfers the host role to the next player', () => {
                lobby.join(player1);
                lobby.join(player2);

                lobby.leave(player1.getSecretId());

                expect(lobby.isHost(player2.getSecretId())).toBe(true);
            });
        });
    });

    describe('markAsReady()', () => {
        describe('when the player is in the lobby', () => {
            it('contributes to the lobby becoming ready to start', () => {
                lobby.join(player1);
                lobby.join(player2);

                lobby.markAsReady(player1.getSecretId());
                lobby.markAsReady(player2.getSecretId());

                expect(lobby.canStart()).toBe(true);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('updates the player status', () => {
                expect(() => {
                    lobby.markAsReady(player1.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });
});
