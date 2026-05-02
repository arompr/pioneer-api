import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGameConfigRepository } from '#game/infrastructure/db/inMemory/GameConfigRepository';
import { GameConfigMother } from '#test/game/domain/config/GameConfigMother';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameMode } from '#game/domain/config/GameMode';
import { GameConfig } from '#game/domain/config/GameConfig';

let repository: InMemoryGameConfigRepository;

describe('InMemoryGameConfigRepository', () => {
    beforeEach(() => {
        repository = new InMemoryGameConfigRepository();
    });

    describe('save', () => {
        describe('when saving a single GameConfig', () => {
            it('stores the config in the repository', () => {
                const config = GameConfigMother.baseConfig();

                repository.save(config);

                const found = repository.findById(config.gameConfigId);
                expect(found).toBe(config);
            });
        });

        describe('when saving multiple GameConfigs', () => {
            it('stores all configs independently', () => {
                const config1 = GameConfigMother.withId(new GameConfigId('id-1'));
                const config2 = GameConfigMother.withId(new GameConfigId('id-2'));

                repository.save(config1);
                repository.save(config2);

                expect(repository.findById(config1.gameConfigId)).toBe(config1);
                expect(repository.findById(config2.gameConfigId)).toBe(config2);
            });
        });

        describe('when saving a config with the same ID as an existing one', () => {
            it('overwrites the previous config', () => {
                const id = new GameConfigId('shared-id');
                const config1 = new GameConfig(id, GameMode.BASE, 2, 3);
                const config2 = new GameConfig(id, GameMode.BASE, 1, 5);

                repository.save(config1);
                repository.save(config2);

                const found = repository.findById(id);
                expect(found?.minPlayers).toBe(1);
                expect(found?.maxPlayers).toBe(5);
            });
        });
    });

    describe('findById', () => {
        describe('when a config exists', () => {
            it('returns the config', () => {
                const config = GameConfigMother.baseConfig();
                repository.save(config);

                const found = repository.findById(config.gameConfigId);

                expect(found).toBe(config);
            });

            it('returns the correct config by its ID', () => {
                const config1 = GameConfigMother.withId(new GameConfigId('id-1'));
                const config2 = GameConfigMother.withId(new GameConfigId('id-2'));
                repository.save(config1);
                repository.save(config2);

                const found = repository.findById(config2.gameConfigId);

                expect(found?.gameConfigId.equals(config2.gameConfigId)).toBe(true);
            });
        });

        describe('when a config does not exist', () => {
            it('returns null', () => {
                const nonExistentId = new GameConfigId('non-existent-id');

                const found = repository.findById(nonExistentId);

                expect(found).toBeNull();
            });
        });

        describe('when querying an empty repository', () => {
            it('returns null for any ID', () => {
                const id = new GameConfigId('any-id');

                const found = repository.findById(id);

                expect(found).toBeNull();
            });
        });
    });

    describe('delete', () => {
        describe('when deleting an existing config', () => {
            it('removes the config from the repository', () => {
                const config = GameConfigMother.baseConfig();
                repository.save(config);

                repository.delete(config.gameConfigId);

                const found = repository.findById(config.gameConfigId);
                expect(found).toBeNull();
            });
        });

        describe('when deleting one of multiple configs', () => {
            it('removes only the specified config', () => {
                const config1 = GameConfigMother.withId(new GameConfigId('id-1'));
                const config2 = GameConfigMother.withId(new GameConfigId('id-2'));
                repository.save(config1);
                repository.save(config2);

                repository.delete(config1.gameConfigId);

                expect(repository.findById(config1.gameConfigId)).toBeNull();
                expect(repository.findById(config2.gameConfigId)).toBe(config2);
            });
        });

        describe('when deleting a non-existent config', () => {
            it('does not throw an error', () => {
                const id = new GameConfigId('non-existent-id');

                expect(() => repository.delete(id)).not.toThrow();
            });
        });

        describe('when deleting from an empty repository', () => {
            it('does not throw an error', () => {
                const id = new GameConfigId('any-id');

                expect(() => repository.delete(id)).not.toThrow();
            });
        });
    });

    describe('integration scenarios', () => {
        describe('save, find, delete cycle', () => {
            it('allows full CRUD operations', () => {
                const config = GameConfigMother.baseConfig();

                // Create
                repository.save(config);
                expect(repository.findById(config.gameConfigId)).toBe(config);

                // Delete
                repository.delete(config.gameConfigId);
                expect(repository.findById(config.gameConfigId)).toBeNull();
            });
        });

        describe('multiple configs stored simultaneously', () => {
            it('maintains all configs independently', () => {
                const configs = [
                    GameConfigMother.withId(new GameConfigId('id-a')),
                    GameConfigMother.withId(new GameConfigId('id-b')),
                    GameConfigMother.withId(new GameConfigId('id-c')),
                ];

                configs.forEach((config) => repository.save(config));

                configs.forEach((config) => {
                    const found = repository.findById(config.gameConfigId);
                    expect(found?.gameConfigId.equals(config.gameConfigId)).toBe(true);
                });

                expect(repository.findById(new GameConfigId('id-d'))).toBeNull();
            });
        });
    });
});
