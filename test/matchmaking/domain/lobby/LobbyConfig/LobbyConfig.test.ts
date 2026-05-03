import { describe, expect, it } from 'vitest';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';

const DEFAULT_GAME_CONFIG_ID = new GameConfigId('game-config-id');
const DEFAULT_MIN_PLAYERS = 3;
const DEFAULT_MAX_PLAYERS = 4;

describe('LobbyConfig', () => {
    describe('creation', () => {
        describe('when the parameters are valid', () => {
            it('sets the config correctly', () => {
                const config = new LobbyConfig(
                    DEFAULT_GAME_CONFIG_ID,
                    DEFAULT_MIN_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.getGameConfigId()).toEqual(DEFAULT_GAME_CONFIG_ID);
                expect(config.getMinPlayers()).toBe(DEFAULT_MIN_PLAYERS);
                expect(config.getMaxPlayers()).toBe(DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when minPlayers equals maxPlayers', () => {
            it('sets the config correctly', () => {
                const config = new LobbyConfig(
                    DEFAULT_GAME_CONFIG_ID,
                    DEFAULT_MAX_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.getGameConfigId()).toEqual(DEFAULT_GAME_CONFIG_ID);
                expect(config.getMinPlayers()).toBe(DEFAULT_MAX_PLAYERS);
                expect(config.getMaxPlayers()).toBe(DEFAULT_MAX_PLAYERS);
            });
        });
    });
});
