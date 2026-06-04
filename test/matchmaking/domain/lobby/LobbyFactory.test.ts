import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Player } from '#matchmaking/domain/player/Player';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyIdFactory } from '#matchmaking/domain/lobby/lobbyId/LobbyIdFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerMother } from '#test/matchmaking/domain/player/PlayerMother';
import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';

const GAME_CONFIG_ID = new GameConfigId('base');

const mockGameGateway: Partial<IGameGateway> = {
    createConfig: vi.fn().mockResolvedValue({ configId: GAME_CONFIG_ID }),
    validatePlayerCount: vi.fn().mockResolvedValue(true),
};

const lobbyIdFactory: LobbyIdFactory = new LobbyIdFactory();
let lobbyFactory: LobbyFactory;
let hostPlayer: Player;
let lobby: LobbyAggregate;

describe('LobbyFactory', () => {
    beforeEach(async () => {
        lobbyFactory = new LobbyFactory(lobbyIdFactory, mockGameGateway as IGameGateway);
        hostPlayer = PlayerMother.anyPlayer();
        lobby = await lobbyFactory.create(hostPlayer);
    });

    describe('create', () => {
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
