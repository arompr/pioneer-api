import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameConfigController } from '#game/interface/http/gameconfig/GameConfigController';
import { CreateDefaultGameConfigUseCase } from '#game/usecase/CreateDefaultGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { CreateDefaultGameConfigRequest } from '#game/interface/http/gameconfig/request/CreateDefaultGameConfigRequest';
import { GameConfigMother } from '#test/game/domain/config/GameConfigMother';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigNotFoundError } from '#game/domain/config/errors/GameConfigNotFoundError';
import { UnsupportedGameModeError } from '#game/domain/config/errors/UnsupportedGameModeError';

let controller: GameConfigController;
let mockCreateUseCase: Partial<CreateDefaultGameConfigUseCase>;
let mockGetUseCase: Partial<GetGameConfigUseCase>;

describe('GameConfigController', () => {
    beforeEach(() => {
        mockCreateUseCase = {
            execute: vi.fn(),
        };
        mockGetUseCase = {
            execute: vi.fn(),
        };
        controller = new GameConfigController(
            mockCreateUseCase as CreateDefaultGameConfigUseCase,
            mockGetUseCase as GetGameConfigUseCase
        );
    });

    describe('create', () => {
        describe('when creating a game config with a valid game mode', () => {
            it('calls the use case with the game mode', () => {
                const config = GameConfigMother.baseConfig();
                (mockCreateUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    createdConfig: config,
                });

                const request = new CreateDefaultGameConfigRequest();
                request.gameMode = 'BASE';

                controller.create(request);

                expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
                    gameMode: 'BASE',
                });
            });

            it('returns a GameConfigResponse with the created config data', () => {
                const config = GameConfigMother.baseConfig();
                (mockCreateUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    createdConfig: config,
                });

                const request = new CreateDefaultGameConfigRequest();
                request.gameMode = 'BASE';

                const response = controller.create(request);

                expect(response.id).toBe(config.gameConfigId.value);
                expect(response.gameMode).toBe(config.gameMode);
                expect(response.minPlayers).toBe(config.minPlayers);
                expect(response.maxPlayers).toBe(config.maxPlayers);
            });

            it('returns the correct response structure', () => {
                const config = GameConfigMother.baseConfig();
                (mockCreateUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    createdConfig: config,
                });

                const request = new CreateDefaultGameConfigRequest();
                request.gameMode = 'BASE';

                const response = controller.create(request);

                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('gameMode');
                expect(response).toHaveProperty('minPlayers');
                expect(response).toHaveProperty('maxPlayers');
            });

            it('maps the created config correctly to the response', () => {
                const config = GameConfigMother.withPlayerLimits(2, 5);
                (mockCreateUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    createdConfig: config,
                });

                const request = new CreateDefaultGameConfigRequest();
                request.gameMode = 'BASE';

                const response = controller.create(request);

                expect(response.minPlayers).toBe(2);
                expect(response.maxPlayers).toBe(5);
            });
        });

        describe('when creating a game config with an invalid game mode', () => {
            it('propagates the UnsupportedGameModeError', () => {
                (
                    mockCreateUseCase.execute as unknown as ReturnType<typeof vi.fn>
                ).mockImplementation(() => {
                    throw new UnsupportedGameModeError('INVALID');
                });

                const request = new CreateDefaultGameConfigRequest();
                request.gameMode = 'INVALID';

                expect(() => controller.create(request)).toThrow(UnsupportedGameModeError);
            });
        });
    });

    describe('getById', () => {
        describe('when retrieving an existing game config', () => {
            it('calls the use case with the correct ID', () => {
                const config = GameConfigMother.baseConfig();
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                controller.getById(config.gameConfigId.value);

                // Verify the ID was converted to GameConfigId and passed correctly
                expect(mockGetUseCase.execute).toHaveBeenCalledTimes(1);
                const callArg = (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as InstanceType<typeof GameConfigId>;
                expect(callArg.value).toBe(config.gameConfigId.value);
            });

            it('returns a GameConfigResponse with the found config data', () => {
                const config = GameConfigMother.baseConfig();
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                const response = controller.getById(config.gameConfigId.value);

                expect(response.id).toBe(config.gameConfigId.value);
                expect(response.gameMode).toBe(config.gameMode);
                expect(response.minPlayers).toBe(config.minPlayers);
                expect(response.maxPlayers).toBe(config.maxPlayers);
            });

            it('converts the string ID to GameConfigId', () => {
                const config = GameConfigMother.baseConfig();
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                const idString = config.gameConfigId.value;
                controller.getById(idString);

                const mockFn = mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>;
                const callArg = mockFn.mock.calls[0][0] as InstanceType<typeof GameConfigId>;
                expect(callArg).toBeInstanceOf(GameConfigId);
                expect(callArg.value).toBe(idString);
            });

            it('returns the correct response structure', () => {
                const config = GameConfigMother.baseConfig();
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                const response = controller.getById(config.gameConfigId.value);

                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('gameMode');
                expect(response).toHaveProperty('minPlayers');
                expect(response).toHaveProperty('maxPlayers');
            });
        });

        describe('when retrieving a non-existent game config', () => {
            it('propagates the GameConfigNotFoundError', () => {
                const nonExistentId = new GameConfigId('non-existent');
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockImplementation(
                    () => {
                        throw new GameConfigNotFoundError(nonExistentId);
                    }
                );

                expect(() => controller.getById('non-existent')).toThrow(GameConfigNotFoundError);
            });
        });

        describe('with various ID formats', () => {
            it('handles UUID-style IDs', () => {
                const uuidId = '123e4567-e89b-12d3-a456-426614174000';
                const config = GameConfigMother.withId(new GameConfigId(uuidId));
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                const response = controller.getById(uuidId);

                expect(response.id).toBe(uuidId);
            });

            it('handles simple string IDs', () => {
                const simpleId = 'simple-id';
                const config = GameConfigMother.withId(new GameConfigId(simpleId));
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                const response = controller.getById(simpleId);

                expect(response.id).toBe(simpleId);
            });

            it('handles numeric string IDs', () => {
                const numericId = '12345';
                const config = GameConfigMother.withId(new GameConfigId(numericId));
                (mockGetUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    foundConfig: config,
                });

                const response = controller.getById(numericId);

                expect(response.id).toBe(numericId);
            });
        });
    });

    describe('response mapping', () => {
        describe('GameConfigMapper integration', () => {
            it('correctly maps all config properties to response', () => {
                const config = GameConfigMother.withPlayerLimits(1, 6);
                (mockCreateUseCase.execute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                    createdConfig: config,
                });

                const request = new CreateDefaultGameConfigRequest();
                request.gameMode = 'BASE';

                const response = controller.create(request);

                expect(response).toEqual({
                    id: config.gameConfigId.value,
                    gameMode: config.gameMode,
                    minPlayers: 1,
                    maxPlayers: 6,
                });
            });
        });
    });
});
