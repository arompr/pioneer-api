import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '../Lobby';
import { LobbyPlayers } from '../LobbyPlayers';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyId } from '../lobbyId/LobbyId';
import { LobbyConfig } from '../LobbyConfig/LobbyConfig';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyGameMode } from '../LobbyConfig/LobbyGameMode';
import { WaitingForPlayersState } from './WaitingForPlayersState';
import { LobbyFullError } from '../errors/LobbyFullError';
import { LobbyNotReadyToStartError } from '../errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { PlayerNotFoundInLobbyError } from '../errors/PlayerNotFoundInLobbyError';

const LOBBY_ID = new LobbyId('lobby-id');
const LOBBY_MIN_CAPACITY = 2;
const LOBBY_MAX_CAPACITY = 3;
const LOBBY_CONFIG = new LobbyConfig(LobbyGameMode.BASE, LOBBY_MIN_CAPACITY, LOBBY_MAX_CAPACITY);

let lobby: Lobby;
let players: LobbyPlayers;
let player1: Player;
let player2: Player;
let player3: Player;
let player4: Player;

describe('WaitingForPlayersState', () => {
    beforeEach(() => {
        players = new LobbyPlayers();
        player1 = new Player(new PlayerId(`secret-1`), new PlayerId(`public-1`), `player-1`);
        player2 = new Player(new PlayerId(`secret-2`), new PlayerId(`public-2`), `player-2`);
        player3 = new Player(new PlayerId(`secret-3`), new PlayerId(`public-3`), `player-3`);
        player4 = new Player(new PlayerId(`secret-4`), new PlayerId(`public-4`), `player-4`);

        players.add(player1);
        lobby = new Lobby(
            LOBBY_ID,
            LOBBY_CONFIG,
            player1.getSecretId(),
            players,
            new WaitingForPlayersState()
        );
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
