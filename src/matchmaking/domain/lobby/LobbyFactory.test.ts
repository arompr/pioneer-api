import { beforeEach, describe, expect, it } from 'vitest';
import { Player } from '../player/Player';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyGameMode } from './LobbyConfig/LobbyGameMode';
import { LobbyIdFactory } from './lobbyId/LobbyIdFactory';
import { LobbyFactory } from './LobbyFactory';
import { PlayerMother } from '#test/matchmaking/domain/player/PlayerMother';
import { LobbyAggregate } from './LobbyAggregate.type';

const LOBBY_MIN_CAPACITY = 2;
const LOBBY_MAX_CAPACITY = 3;
const LOBBY_CONFIG = new LobbyConfig(LobbyGameMode.BASE, LOBBY_MIN_CAPACITY, LOBBY_MAX_CAPACITY);
const lobbyIdFactory: LobbyIdFactory = new LobbyIdFactory();
let lobbyFactory: LobbyFactory;
let hostPlayer: Player;
let lobby: LobbyAggregate;

describe('LobbyFactory', () => {
    beforeEach(() => {
        lobbyFactory = new LobbyFactory(lobbyIdFactory);
        hostPlayer = PlayerMother.anyPlayer();
        lobby = lobbyFactory.create(LOBBY_CONFIG, hostPlayer);
    });

    describe('create()', () => {
        describe('when creating a new lobby', () => {
            it('should have one initial player', () => {
                expect(lobby.playerCount).toBe(1);
            });

            it('should set the host', () => {
                expect(lobby.isHost(hostPlayer.id)).toBe(true);
            });
        });
    });
});
