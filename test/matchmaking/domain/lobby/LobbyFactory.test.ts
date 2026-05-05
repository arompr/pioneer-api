import { beforeEach, describe, expect, it } from 'vitest';
import { Player } from '#matchmaking/domain/player/Player';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyIdFactory } from '#matchmaking/domain/lobby/lobbyId/LobbyIdFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerMother } from '#test/matchmaking/domain/player/PlayerMother';
import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';

const GAME_CONFIG_ID = new GameConfigId('base');
const lobbyIdFactory: LobbyIdFactory = new LobbyIdFactory();
let lobbyFactory: LobbyFactory;
let hostPlayer: Player;
let lobby: LobbyAggregate;

describe('LobbyFactory', () => {
    beforeEach(() => {
        lobbyFactory = new LobbyFactory(lobbyIdFactory);
        hostPlayer = PlayerMother.anyPlayer();
        lobby = lobbyFactory.create(hostPlayer, GAME_CONFIG_ID);
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
