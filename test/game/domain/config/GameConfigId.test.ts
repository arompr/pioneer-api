import { describe, expect, it } from 'vitest';
import { GameConfigId } from '#game/domain/config/GameConfigId';

describe('GameConfigId', () => {
    describe('creation', () => {
        describe('when creating a GameConfigId with a string', () => {
            it('stores the provided string value', () => {
                const id = new GameConfigId('my-config-id');

                expect(id.value).toBe('my-config-id');
            });
        });
    });

    describe('equals', () => {
        describe('when comparing two GameConfigIds with the same value', () => {
            it('returns true', () => {
                const id1 = new GameConfigId('same-id');
                const id2 = new GameConfigId('same-id');

                expect(id1.equals(id2)).toBe(true);
            });
        });

        describe('when comparing two GameConfigIds with different values', () => {
            it('returns false', () => {
                const id1 = new GameConfigId('id-1');
                const id2 = new GameConfigId('id-2');

                expect(id1.equals(id2)).toBe(false);
            });
        });
    });

    describe('toString', () => {
        describe('when calling toString', () => {
            it('returns the string value', () => {
                const id = new GameConfigId('config-abc-123');

                expect(id.toString()).toBe('config-abc-123');
            });
        });
    });
});
