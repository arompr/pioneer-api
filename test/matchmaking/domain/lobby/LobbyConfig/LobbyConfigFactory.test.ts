import { describe, expect, it } from 'vitest';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';
import { UnsupportedGameModeError } from '#matchmaking/domain/lobby/errors/UnsupportedGameModeError';

const factory = new LobbyConfigFactory();

describe('LobbyConfigFactory', () => {
    describe('createFromGameMode', () => {
        describe('when the game mode is supported', () => {
            it('creates a LobbyConfig with the correct mode', () => {
                const config = factory.createFromGameMode(LobbyGameMode.BASE);

                expect(config.getGameMode()).toBe(LobbyGameMode.BASE);
            });
        });

        describe('when the game mode is not supported', () => {
            it('throws an UnsupportedGameModeError', () => {
                const unsupportedMode = 'nonexistent-mode' as LobbyGameMode;

                expect(() => factory.createFromGameMode(unsupportedMode)).toThrow(
                    UnsupportedGameModeError
                );
            });
        });
    });
});
