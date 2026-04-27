import { describe, expect, it } from 'vitest';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { GameMode } from '#game/domain/config/GameMode';
import { UnsupportedGameModeError } from '#game/domain/config/errors/UnsupportedGameModeError';

const factory = new GameConfigFactory();

describe('GameConfigFactory', () => {
    describe('createFromGameMode', () => {
        describe('when the game mode is supported', () => {
            it('creates a GameConfig with the correct mode', () => {
                const config = factory.createFromGameMode(GameMode.BASE);

                expect(config.gameMode).toBe(GameMode.BASE);
            });

            it('creates a GameConfig with the correct player limits for BASE mode', () => {
                const config = factory.createFromGameMode(GameMode.BASE);

                expect(config.minPlayers).toBe(3);
                expect(config.maxPlayers).toBe(4);
            });
        });

        describe('when the game mode is not supported', () => {
            it('throws an UnsupportedGameModeError', () => {
                const unsupportedMode = 'nonexistent-mode' as GameMode;

                expect(() => factory.createFromGameMode(unsupportedMode)).toThrow(
                    UnsupportedGameModeError
                );
            });
        });
    });
});
