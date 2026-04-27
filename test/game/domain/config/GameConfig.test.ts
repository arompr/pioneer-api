import { describe, expect, it } from 'vitest';
import { GameMode } from '#game/domain/config/GameMode';
import { GameConfig } from '#game/domain/config/GameConfig';
import { InvalidMinPlayersError } from '#game/domain/config/errors/InvalidMinPlayersError';
import { MinPlayersExceedsMaxPlayersError } from '#game/domain/config/errors/MinPlayersExceedsMaxPlayersError';

const DEFAULT_MODE: GameMode = GameMode.BASE;
const DEFAULT_MIN_PLAYERS = 3;
const DEFAULT_MAX_PLAYERS = 4;

describe('GameConfig', () => {
    describe('creation', () => {
        describe('when the parameters are valid', () => {
            it('sets the config correctly', () => {
                const config = new GameConfig(
                    DEFAULT_MODE,
                    DEFAULT_MIN_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.gameMode).toBe(DEFAULT_MODE);
                expect(config.minPlayers).toBe(DEFAULT_MIN_PLAYERS);
                expect(config.maxPlayers).toBe(DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when minPlayers equals maxPlayers', () => {
            it('sets the config correctly', () => {
                const config = new GameConfig(
                    DEFAULT_MODE,
                    DEFAULT_MAX_PLAYERS,
                    DEFAULT_MAX_PLAYERS
                );

                expect(config.gameMode).toBe(DEFAULT_MODE);
                expect(config.minPlayers).toBe(DEFAULT_MAX_PLAYERS);
                expect(config.maxPlayers).toBe(DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when minPlayers is less than 1', () => {
            it('throws InvalidMinPlayersError', () => {
                expect(() => new GameConfig(DEFAULT_MODE, 0, DEFAULT_MAX_PLAYERS)).toThrow(
                    InvalidMinPlayersError
                );
            });
        });

        describe('when minPlayers exceeds maxPlayers', () => {
            it('throws MinPlayersExceedsMaxPlayersError', () => {
                expect(() => new GameConfig(DEFAULT_MODE, 5, 4)).toThrow(
                    MinPlayersExceedsMaxPlayersError
                );
            });
        });
    });
});
