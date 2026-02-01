import { describe, expect, it } from 'vitest';
import { LobbyConfigFactory } from './LobbyConfigFactory.ts';
import { LobbyGameMode } from './LobbyGameMode.ts';
import { UnsupportedGameModeError } from '../errors/UnsupportedGameModeError.ts';

describe('LobbyConfigFactory', () => {
    describe('createFromGameMode()', () => {
        describe('when the game mode is supported', () => {
            it('creates a LobbyConfig with the correct mode', () => {
                const config = LobbyConfigFactory.createFromGameMode(LobbyGameMode.BASE);

                expect(config.getGameMode()).toBe(LobbyGameMode.BASE);
            });
        });

        describe('when the game mode is not supported', () => {
            it('throws an UnsupportedGameModeError', () => {
                const unsupportedMode = 'nonexistent-mode' as LobbyGameMode;

                expect(() => LobbyConfigFactory.createFromGameMode(unsupportedMode)).toThrow(
                    UnsupportedGameModeError,
                );
            });
        });
    });
});
