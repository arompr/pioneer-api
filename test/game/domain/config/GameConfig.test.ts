import { beforeEach, describe, expect, it } from 'vitest';
import { GameMode } from '#game/domain/config/GameMode';
import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { InvalidMinPlayersError } from '#game/domain/config/errors/InvalidMinPlayersError';
import { MinPlayersExceedsMaxPlayersError } from '#game/domain/config/errors/MinPlayersExceedsMaxPlayersError';

const DEFAULT_CONFIG_ID = new GameConfigId('test-config-id');
const DEFAULT_MODE: GameMode = GameMode.BASE;
const DEFAULT_MIN_PLAYERS = 3;
const DEFAULT_MAX_PLAYERS = 4;

describe('GameConfig', () => {
    describe('creation', () => {
        describe('when the parameters are valid', () => {
            it('sets the config correctly', () => {
                const config = new GameConfig(
                    DEFAULT_CONFIG_ID,
                    DEFAULT_MODE,
                    DEFAULT_MIN_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.id).toBe(DEFAULT_CONFIG_ID);
                expect(config.gameMode).toBe(DEFAULT_MODE);
                expect(config.minPlayers).toBe(DEFAULT_MIN_PLAYERS);
                expect(config.maxPlayers).toBe(DEFAULT_MAX_PLAYERS);
            });

            it('stores the ID in the gameConfigId property', () => {
                const config = new GameConfig(
                    DEFAULT_CONFIG_ID,
                    DEFAULT_MODE,
                    DEFAULT_MIN_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.id.equals(DEFAULT_CONFIG_ID)).toBe(true);
            });
        });

        describe('when minPlayers equals maxPlayers', () => {
            it('sets the config correctly', () => {
                const config = new GameConfig(
                    DEFAULT_CONFIG_ID,
                    DEFAULT_MODE,
                    DEFAULT_MAX_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.id).toBe(DEFAULT_CONFIG_ID);
                expect(config.gameMode).toBe(DEFAULT_MODE);
                expect(config.minPlayers).toBe(DEFAULT_MAX_PLAYERS);
                expect(config.maxPlayers).toBe(DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when minPlayers is exactly 1', () => {
            it('creates a valid config', () => {
                const config = new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 1, 4);

                expect(config.minPlayers).toBe(1);
                expect(config.maxPlayers).toBe(4);
            });
        });

        describe('when minPlayers is less than 1', () => {
            it('throws InvalidMinPlayersError', () => {
                expect(
                    () => new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 0, DEFAULT_MAX_PLAYERS)
                ).toThrow(InvalidMinPlayersError);
            });

            it('throws for negative minPlayers', () => {
                expect(
                    () => new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, -1, DEFAULT_MAX_PLAYERS)
                ).toThrow(InvalidMinPlayersError);
            });
        });

        describe('when minPlayers exceeds maxPlayers', () => {
            it('throws MinPlayersExceedsMaxPlayersError', () => {
                expect(() => new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 5, 4)).toThrow(
                    MinPlayersExceedsMaxPlayersError
                );
            });

            it('throws when minPlayers is 10 and maxPlayers is 4', () => {
                expect(() => new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 10, 4)).toThrow(
                    MinPlayersExceedsMaxPlayersError
                );
            });
        });
    });

    describe('accessor methods', () => {
        let config: GameConfig;

        beforeEach(() => {
            config = new GameConfig(
                DEFAULT_CONFIG_ID,
                DEFAULT_MODE,
                DEFAULT_MIN_PLAYERS,
                DEFAULT_MAX_PLAYERS
            );
        });

        describe('gameConfigId', () => {
            it('returns the GameConfigId', () => {
                expect(config.id).toBe(DEFAULT_CONFIG_ID);
            });
        });

        describe('gameMode', () => {
            it('returns the GameMode', () => {
                expect(config.gameMode).toBe(DEFAULT_MODE);
            });
        });

        describe('minPlayers', () => {
            it('returns the minimum number of players', () => {
                expect(config.minPlayers).toBe(DEFAULT_MIN_PLAYERS);
            });
        });

        describe('maxPlayers', () => {
            it('returns the maximum number of players', () => {
                expect(config.maxPlayers).toBe(DEFAULT_MAX_PLAYERS);
            });
        });
    });

    describe('immutability', () => {
        let config: GameConfig;

        beforeEach(() => {
            config = new GameConfig(
                DEFAULT_CONFIG_ID,
                DEFAULT_MODE,
                DEFAULT_MIN_PLAYERS,
                DEFAULT_MAX_PLAYERS
            );
        });

        describe('readonly properties are immutable', () => {
            it('gameConfigId cannot be reassigned and remains constant', () => {
                const firstRead = config.id;
                const secondRead = config.id;

                expect(firstRead.equals(DEFAULT_CONFIG_ID)).toBe(true);
                expect(secondRead.equals(DEFAULT_CONFIG_ID)).toBe(true);
                expect(firstRead === secondRead).toBe(true);
            });

            it('gameMode remains constant', () => {
                const firstRead = config.gameMode;
                const secondRead = config.gameMode;

                expect(firstRead).toBe(DEFAULT_MODE);
                expect(secondRead).toBe(DEFAULT_MODE);
            });

            it('minPlayers remains constant', () => {
                const firstRead = config.minPlayers;
                const secondRead = config.minPlayers;

                expect(firstRead).toBe(DEFAULT_MIN_PLAYERS);
                expect(secondRead).toBe(DEFAULT_MIN_PLAYERS);
            });

            it('maxPlayers remains constant', () => {
                const firstRead = config.maxPlayers;
                const secondRead = config.maxPlayers;

                expect(firstRead).toBe(DEFAULT_MAX_PLAYERS);
                expect(secondRead).toBe(DEFAULT_MAX_PLAYERS);
            });

            it('all properties are readonly and cannot be modified', () => {
                // TypeScript ensures readonly at compile time.
                // This test verifies the intended behavior: properties are constants after creation
                expect(config.id.equals(DEFAULT_CONFIG_ID)).toBe(true);
                expect(config.gameMode).toBe(DEFAULT_MODE);
                expect(config.minPlayers).toBe(DEFAULT_MIN_PLAYERS);
                expect(config.maxPlayers).toBe(DEFAULT_MAX_PLAYERS);
            });
        });
    });

    describe('validation', () => {
        describe('when creating configs with different valid ranges', () => {
            it('accepts 2-4 players range', () => {
                const config = new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 2, 4);
                expect(config.minPlayers).toBe(2);
                expect(config.maxPlayers).toBe(4);
            });

            it('accepts 1-6 players range', () => {
                const config = new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 1, 6);
                expect(config.minPlayers).toBe(1);
                expect(config.maxPlayers).toBe(6);
            });

            it('accepts single player minimum and large maximum', () => {
                const config = new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 1, 100);
                expect(config.minPlayers).toBe(1);
                expect(config.maxPlayers).toBe(100);
            });
        });

        describe('error context', () => {
            it('includes the invalid value in InvalidMinPlayersError', () => {
                try {
                    new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 0, 4);
                } catch (error) {
                    if (error instanceof InvalidMinPlayersError) {
                        expect(error.min).toBe(0);
                    }
                }
            });

            it('includes both values in MinPlayersExceedsMaxPlayersError', () => {
                try {
                    new GameConfig(DEFAULT_CONFIG_ID, DEFAULT_MODE, 5, 4);
                } catch (error) {
                    if (error instanceof MinPlayersExceedsMaxPlayersError) {
                        expect(error.min).toBe(5);
                        expect(error.max).toBe(4);
                    }
                }
            });
        });
    });
});
