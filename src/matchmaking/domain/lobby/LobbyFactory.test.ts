import { beforeEach, describe, expect, it } from 'vitest';
import { Player } from '../player/Player';
import { PlayerId } from '../player/playerId/PlayerId';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyGameMode } from './LobbyConfig/LobbyGameMode';
import { LobbyIdFactory } from './lobbyId/LobbyIdFactory';
import { LobbyStatus } from './LobbyStatus';
import { Lobby } from './Lobby';
import { LobbyFactory } from './LobbyFactory';

const LOBBY_MIN_CAPACITY = 2;
const LOBBY_MAX_CAPACITY = 3;
const LOBBY_CONFIG = new LobbyConfig(LobbyGameMode.BASE, LOBBY_MIN_CAPACITY, LOBBY_MAX_CAPACITY);
const lobbyIdFactory: LobbyIdFactory = new LobbyIdFactory();
let lobbyFactory: LobbyFactory;
let hostPlayer: Player;
let lobby: Lobby;

describe('LobbyFactory', () => {
    beforeEach(() => {
        lobbyFactory = new LobbyFactory(lobbyIdFactory);
        hostPlayer = new Player(new PlayerId(`secret-id`), new PlayerId(`public-id`), 'player-name');

        lobby = lobbyFactory.create(LOBBY_CONFIG, hostPlayer);
    });

    describe('create()', () => {
        describe('when creating a new lobby', () => {
            it('should have one initial player', () => {
                expect(lobby.playerCount).toBe(1);
            });

            it('should set the host', () => {
                expect(lobby.isHost(hostPlayer.getSecretId())).toBe(true);
            });

            it('should initialize the lobby in a waiting state', () => {
                expect(lobby.status).toBe(LobbyStatus.WAITING_FOR_PLAYERS);
            });
        });
    });
});
