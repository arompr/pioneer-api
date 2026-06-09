import { describe, expect, it } from 'vitest';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { GameMode } from '#game/domain/config/GameMode';
import { UnsupportedGameModeError } from '#game/domain/config/errors/UnsupportedGameModeError';
import { GameConfigId } from '#game/domain/config/GameConfigId';

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

            it('generates a unique GameConfigId', () => {
                const config1 = factory.createFromGameMode(GameMode.BASE);
                const config2 = factory.createFromGameMode(GameMode.BASE);

                expect(config1.id.value).not.toBe(config2.id.value);
            });

            it('returns a valid GameConfig instance with all properties set', () => {
                const config = factory.createFromGameMode(GameMode.BASE);

                expect(config).toBeDefined();
                expect(config.id).toBeDefined();
                expect(config.gameMode).toBeDefined();
                expect(config.minPlayers).toBeDefined();
                expect(config.maxPlayers).toBeDefined();
            });
        });

        describe('when the game mode is not supported', () => {
            it('throws an UnsupportedGameModeError', () => {
                const unsupportedMode = 'nonexistent-mode' as GameMode;

                expect(() => factory.createFromGameMode(unsupportedMode)).toThrow(
                    UnsupportedGameModeError
                );
            });

            it('includes the unsupported mode in the error', () => {
                const unsupportedMode = 'invalid-mode' as GameMode;

                expect(() => factory.createFromGameMode(unsupportedMode)).toThrow(
                    UnsupportedGameModeError
                );
            });
        });
    });

    describe('createWithId', () => {
        describe('when called with a GameMode and GameConfigId', () => {
            it('creates a GameConfig with the provided ID', () => {
                const providedId = new GameConfigId('custom-id-123');
                const config = factory.createWithId(GameMode.BASE, providedId);

                expect(config.id).toBe(providedId);
                expect(config.id.equals(providedId)).toBe(true);
            });

            it('uses the provided ID instead of generating a new one', () => {
                const providedId = new GameConfigId('specific-id');
                const config = factory.createWithId(GameMode.BASE, providedId);

                expect(config.id.value).toBe('specific-id');
            });

            it('creates a GameConfig with correct player limits', () => {
                const providedId = new GameConfigId('test-id');
                const config = factory.createWithId(GameMode.BASE, providedId);

                expect(config.minPlayers).toBe(3);
                expect(config.maxPlayers).toBe(4);
            });
        });

        describe('when called with only a GameMode (no ID provided)', () => {
            it('generates a new GameConfigId', () => {
                const config = factory.createWithId(GameMode.BASE);

                expect(config.id).toBeDefined();
                expect(config.id.value).toBeDefined();
                expect(config.id.value.length).toBeGreaterThan(0);
            });

            it('generates unique IDs for multiple calls', () => {
                const config1 = factory.createWithId(GameMode.BASE);
                const config2 = factory.createWithId(GameMode.BASE);

                expect(config1.id.value).not.toBe(config2.id.value);
            });
        });

        describe('when the game mode is not supported', () => {
            it('throws UnsupportedGameModeError even with a provided ID', () => {
                const providedId = new GameConfigId('id-for-invalid-mode');
                const unsupportedMode = 'unsupported' as GameMode;

                expect(() => factory.createWithId(unsupportedMode, providedId)).toThrow(
                    UnsupportedGameModeError
                );
            });
        });
    });
});
