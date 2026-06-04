import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { CreateGameConfigDto } from '#game/usecase/dto/CreateGameConfigDto';
import { GameMode } from '#game/domain/config/GameMode';
import { InvalidGameModeError } from '#game/domain/config/errors/InvalidGameModeError';

let useCase: CreateGameConfigUseCase;
let mockRepository: Partial<GameConfigRepository>;
let factory: GameConfigFactory;

describe('CreateGameConfigUseCase', () => {
    beforeEach(() => {
        factory = new GameConfigFactory();
        mockRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            delete: vi.fn(),
        };
        useCase = new CreateGameConfigUseCase(factory, mockRepository as GameConfigRepository);
    });

    describe('execute', () => {
        describe('when called with a supported game mode', () => {
            it('returns a GameConfig with valid properties', () => {
                const dto = new CreateGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(result.createdConfig).toBeDefined();
                expect(result.createdConfig.id).toBeDefined();
                expect(result.createdConfig.gameMode).toBe(GameMode.BASE);
                expect(result.createdConfig.minPlayers).toBe(3);
                expect(result.createdConfig.maxPlayers).toBe(4);
            });

            it('saves the created GameConfig to the repository', () => {
                const dto = new CreateGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(mockRepository.save).toHaveBeenCalledWith(result.createdConfig);
                expect(mockRepository.save).toHaveBeenCalledTimes(1);
            });

            it('returns the created config in the result', () => {
                const dto = new CreateGameConfigDto('BASE');

                const result = useCase.execute(dto);

                expect(result.createdConfig).toBeDefined();
                expect(result.createdConfig.gameMode).toBe(GameMode.BASE);
            });
        });

        describe('when called with an unsupported game mode', () => {
            it('throws InvalidGameModeError for unsupported mode', () => {
                const dto = new CreateGameConfigDto('INVALID_MODE');

                expect(() => useCase.execute(dto)).toThrow(InvalidGameModeError);
            });

            it('does not save to the repository when an error occurs', () => {
                const dto = new CreateGameConfigDto('INVALID_MODE');

                try {
                    useCase.execute(dto);
                } catch {
                    // Expected to throw
                }

                expect(mockRepository.save).not.toHaveBeenCalled();
            });
        });
    });
});
