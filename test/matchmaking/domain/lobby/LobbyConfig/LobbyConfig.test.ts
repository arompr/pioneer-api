import { describe, expect, it } from 'vitest';
import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';
import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { InvalidMinPlayersError } from '#matchmaking/domain/lobby/errors/InvalidMinPlayersError';
import { MinPlayersExceedsMaxPlayersError } from '#matchmaking/domain/lobby/errors/MinPlayersExceedsMaxPlayersError';

const DEFAULT_MODE: LobbyGameMode = LobbyGameMode.BASE;
const DEFAULT_MIN_PLAYERS = 3;
const DEFAULT_MAX_PLAYERS = 4;

describe('LobbyConfig', () => {
    describe('creation', () => {
        describe('when the parameters are valid', () => {
            it('sets the config correctly', () => {
                const config = new LobbyConfig(
                    DEFAULT_MODE,
                    DEFAULT_MIN_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.getGameMode()).toBe(DEFAULT_MODE);
                expect(config.getMinPlayers()).toBe(DEFAULT_MIN_PLAYERS);
                expect(config.getMaxPlayers()).toBe(DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when minPlayers equals maxPlayers', () => {
            it('sets the config correctly', () => {
                const config = new LobbyConfig(
                    DEFAULT_MODE,
                    DEFAULT_MAX_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.getGameMode()).toBe(DEFAULT_MODE);
                expect(config.getMinPlayers()).toBe(DEFAULT_MAX_PLAYERS);
                expect(config.getMaxPlayers()).toBe(DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when minPlayers is less than 1', () => {
            it('throws InvalidMinPlayersError', () => {
                expect(() => new LobbyConfig(DEFAULT_MODE, 0, DEFAULT_MAX_PLAYERS)).toThrow(
                    InvalidMinPlayersError
                );
            });
        });

        describe('when minPlayers exceeds maxPlayers', () => {
            it('throws MinPlayersExceedsMaxPlayersError', () => {
                expect(() => new LobbyConfig(DEFAULT_MODE, 5, 4)).toThrow(
                    MinPlayersExceedsMaxPlayersError
                );
            });
        });
    });
});
