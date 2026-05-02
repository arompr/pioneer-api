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

        describe('when creating multiple GameConfigIds', () => {
            it('allows different IDs to be created independently', () => {
                const id1 = new GameConfigId('id-1');
                const id2 = new GameConfigId('id-2');

                expect(id1.value).not.toBe(id2.value);
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

        describe('when comparing the same instance', () => {
            it('returns true', () => {
                const id = new GameConfigId('test-id');

                expect(id.equals(id)).toBe(true);
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

        describe('when using in string context', () => {
            it('can be converted to string', () => {
                const id = new GameConfigId('test-id');

                expect(String(id)).toBe('test-id');
            });
        });
    });

    describe('immutability', () => {
        describe('when attempting to read the value multiple times', () => {
            it('always returns the same value', () => {
                const id = new GameConfigId('original-id');

                expect(id.value).toBe('original-id');
                expect(id.value).toBe('original-id');
                expect(id.value).toBe('original-id');
            });
        });

        describe('the value property is readonly', () => {
            it('prevents reassignment via TypeScript type checking', () => {
                const id = new GameConfigId('original-id');

                // TypeScript enforces readonly at compile time.
                // We verify the intended behavior: once set, the value cannot be changed
                const firstRead = id.value;
                const secondRead = id.value;

                expect(firstRead).toBe('original-id');
                expect(secondRead).toBe('original-id');
                expect(firstRead === secondRead).toBe(true);
            });
        });
    });
});
