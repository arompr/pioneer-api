import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { GameConfigMother } from '#test/game/domain/config/GameConfigMother';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigNotFoundError } from '#game/domain/config/errors/GameConfigNotFoundError';

let useCase: GetGameConfigUseCase;
let mockRepository: Partial<GameConfigRepository>;

describe('GetGameConfigUseCase', () => {
    beforeEach(() => {
        mockRepository = {
            findById: vi.fn(),
            save: vi.fn(),
            delete: vi.fn(),
        };
        useCase = new GetGameConfigUseCase(mockRepository as GameConfigRepository);
    });

    describe('execute', () => {
        describe('when the game config exists', () => {
            it('returns the game config', () => {
                const config = GameConfigMother.baseConfig();
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                const result = useCase.execute(config.id);

                expect(result.foundConfig).toBe(config);
            });

            it('calls the repository with the correct ID', () => {
                const config = GameConfigMother.baseConfig();
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                useCase.execute(config.id);

                expect(mockRepository.findById).toHaveBeenCalledWith(config.id);
                expect(mockRepository.findById).toHaveBeenCalledTimes(1);
            });

            it('returns all properties of the found config', () => {
                const config = GameConfigMother.baseConfig();
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                const result = useCase.execute(config.id);

                expect(result.foundConfig.id).toBe(config.id);
                expect(result.foundConfig.gameMode).toBe(config.gameMode);
                expect(result.foundConfig.minPlayers).toBe(config.minPlayers);
                expect(result.foundConfig.maxPlayers).toBe(config.maxPlayers);
            });

            it('can retrieve different configs by their IDs', () => {
                const config1 = GameConfigMother.withId(new GameConfigId('id-1'));
                const config2 = GameConfigMother.withId(new GameConfigId('id-2'));

                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockImplementation(
                    (id: GameConfigId) => {
                        if (id.equals(config1.id)) return config1;
                        if (id.equals(config2.id)) return config2;
                        return null;
                    }
                );

                const result1 = useCase.execute(config1.id);
                const result2 = useCase.execute(config2.id);

                expect(result1.foundConfig.id.equals(config1.id)).toBe(true);
                expect(result2.foundConfig.id.equals(config2.id)).toBe(true);
            });
        });

        describe('when the game config does not exist', () => {
            it('throws GameConfigNotFoundError', () => {
                const nonExistentId = new GameConfigId('non-existent-id');
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    null
                );

                expect(() => useCase.execute(nonExistentId)).toThrow(GameConfigNotFoundError);
            });

            it('includes the ID in the error', () => {
                const nonExistentId = new GameConfigId('missing-id');
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    null
                );

                try {
                    useCase.execute(nonExistentId);
                } catch (error) {
                    if (error instanceof GameConfigNotFoundError) {
                        expect(error.gameConfigId.equals(nonExistentId)).toBe(true);
                    }
                }
            });

            it('still calls the repository', () => {
                const nonExistentId = new GameConfigId('missing-id');
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    null
                );

                try {
                    useCase.execute(nonExistentId);
                } catch {
                    // Expected to throw
                }

                expect(mockRepository.findById).toHaveBeenCalledWith(nonExistentId);
            });
        });

        describe('with various ID formats', () => {
            it('handles UUID-style IDs', () => {
                const uuidId = new GameConfigId('123e4567-e89b-12d3-a456-426614174000');
                const config = GameConfigMother.withId(uuidId);
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                const result = useCase.execute(uuidId);

                expect(result.foundConfig.id.equals(uuidId)).toBe(true);
            });

            it('handles simple string IDs', () => {
                const simpleId = new GameConfigId('simple-config-id');
                const config = GameConfigMother.withId(simpleId);
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                const result = useCase.execute(simpleId);

                expect(result.foundConfig.id.equals(simpleId)).toBe(true);
            });

            it('handles numeric string IDs', () => {
                const numericId = new GameConfigId('12345');
                const config = GameConfigMother.withId(numericId);
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                const result = useCase.execute(numericId);

                expect(result.foundConfig.id.equals(numericId)).toBe(true);
            });
        });

        describe('repository interaction', () => {
            it('does not call any other repository methods', () => {
                const config = GameConfigMother.baseConfig();
                (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
                    config
                );

                useCase.execute(config.id);

                expect(mockRepository.save).not.toHaveBeenCalled();
                expect(mockRepository.delete).not.toHaveBeenCalled();
            });
        });
    });
});
