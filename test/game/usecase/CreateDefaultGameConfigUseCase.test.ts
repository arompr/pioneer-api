import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateDefaultGameConfigUseCase } from '#game/usecase/CreateDefaultGameConfigUseCase';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { CreateDefaultGameConfigDto } from '#game/usecase/dto/CreateDefaultGameConfigDto';
import { GameMode } from '#game/domain/config/GameMode';

let useCase: CreateDefaultGameConfigUseCase;
let mockRepository: Partial<GameConfigRepository>;
let factory: GameConfigFactory;

describe('CreateDefaultGameConfigUseCase', () => {
    beforeEach(() => {
        factory = new GameConfigFactory();
        mockRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            delete: vi.fn(),
        };
        useCase = new CreateDefaultGameConfigUseCase(
            factory,
            mockRepository as GameConfigRepository
        );
    });

    describe('execute', () => {
        describe('when called with a supported game mode', () => {
            it('creates a GameConfig with the specified game mode', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(result.createdConfig.gameMode).toBe(GameMode.BASE);
            });

            it('returns a GameConfig with valid properties', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(result.createdConfig).toBeDefined();
                expect(result.createdConfig.id).toBeDefined();
                expect(result.createdConfig.minPlayers).toBe(3);
                expect(result.createdConfig.maxPlayers).toBe(4);
            });

            it('saves the created GameConfig to the repository', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(mockRepository.save).toHaveBeenCalledWith(result.createdConfig);
                expect(mockRepository.save).toHaveBeenCalledTimes(1);
            });

            it('returns the created config in the result', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(result.createdConfig).toBeDefined();
                expect(result.createdConfig.gameMode).toBe(GameMode.BASE);
            });

            it('returns a GameConfigId that can be used to retrieve the config', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(result.createdConfig.id.value).toBeDefined();
                expect(result.createdConfig.id.value.length).toBeGreaterThan(0);
            });

            it('generates a unique GameConfigId for each execution', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result1 = useCase.execute(dto);
                const result2 = useCase.execute(dto);

                expect(result1.createdConfig.id.value).not.toBe(result2.createdConfig.id.value);
            });
        });

        describe('when called with an unsupported game mode', () => {
            it('throws InvalidGameModeError for unsupported mode', () => {
                const dto = new CreateDefaultGameConfigDto('INVALID_MODE');

                // gameModeFromString throws InvalidGameModeError for unsupported modes
                expect(() => useCase.execute(dto)).toThrow();
            });

            it('does not save to the repository when an error occurs', () => {
                const dto = new CreateDefaultGameConfigDto('INVALID_MODE');

                try {
                    useCase.execute(dto);
                } catch {
                    // Expected to throw
                }

                expect(mockRepository.save).not.toHaveBeenCalled();
            });
        });

        describe('when the repository save is called', () => {
            it('passes the created config to save', () => {
                const dto = new CreateDefaultGameConfigDto('BASE');

                const result = useCase.execute(dto);
                const savedConfig = (mockRepository.save as unknown as ReturnType<typeof vi.fn>)
                    .mock.calls[0][0] as typeof result.createdConfig;

                expect(savedConfig.id.equals(result.createdConfig.id)).toBe(true);
                expect(savedConfig.gameMode).toBe(result.createdConfig.gameMode);
                expect(savedConfig.minPlayers).toBe(result.createdConfig.minPlayers);
                expect(savedConfig.maxPlayers).toBe(result.createdConfig.maxPlayers);
            });
        });

        describe('multiple consecutive executions', () => {
            it('creates multiple configs with different IDs', () => {
                const dto: CreateDefaultGameConfigDto = { gameMode: 'BASE' };

                const result1 = useCase.execute(dto);
                const result2 = useCase.execute(dto);
                const result3 = useCase.execute(dto);

                const ids = [
                    result1.createdConfig.id.value,
                    result2.createdConfig.id.value,
                    result3.createdConfig.id.value,
                ];

                expect(new Set(ids).size).toBe(3);
            });

            it('saves all created configs', () => {
                const dto: CreateDefaultGameConfigDto = { gameMode: 'BASE' };

                useCase.execute(dto);
                useCase.execute(dto);
                useCase.execute(dto);

                expect(mockRepository.save).toHaveBeenCalledTimes(3);
            });
        });
    });
});
