import { describe, expect, it } from 'vitest';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';

const factory = new LobbyConfigFactory();

describe('LobbyConfigFactory', () => {
    describe('createFromGameConfigId', () => {
        describe('when the game config ID is provided', () => {
            it('creates a LobbyConfig with the correct game config ID', () => {
                const gameConfigId = new GameConfigId('game-config-id');
                const config = factory.createFromGameConfigId(gameConfigId);

                expect(config.getGameConfigId()).toEqual(gameConfigId);
            });
        });
    });
});
