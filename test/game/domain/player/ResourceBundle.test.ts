import { describe, it, expect, beforeEach } from 'vitest';
import { ResourceBundle } from '#game/domain/player/ResourceBundle';
import { InsufficientResourcesError } from '#game/domain/player/errors/InsufficientResourcesError';
import { InvalidResourceAmountError } from '#game/domain/player/errors/InvalidResourceAmountError';
import { ResourceBundleMother } from './ResourceBundleMother';
import { ResourceType } from '#game/domain/shared/ResourceType';

describe('ResourceBundle', () => {
    describe('empty', () => {
        it('creates an empty resource bundle', () => {
            const bundle = ResourceBundle.empty();

            expect(bundle.total()).toBe(0);
            expect(bundle.get(ResourceType.WOOD)).toBe(0);
        });
    });

    describe('of', () => {
        it('creates a bundle with the specified resources', () => {
            const bundle = ResourceBundle.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
            });

            expect(bundle.get(ResourceType.WOOD)).toBe(2);
            expect(bundle.get(ResourceType.BRICK)).toBe(3);
            expect(bundle.get(ResourceType.SHEEP)).toBe(0);
        });

        it('ignores zero amounts', () => {
            const bundle = ResourceBundle.of({
                [ResourceType.WOOD]: 0,
                [ResourceType.BRICK]: 1,
            });

            expect(bundle.get(ResourceType.WOOD)).toBe(0);
            expect(bundle.get(ResourceType.BRICK)).toBe(1);
        });

        describe('when amount is negative', () => {
            it('throws InvalidResourceAmountError', () => {
                expect(() =>
                    ResourceBundle.of({
                        [ResourceType.WOOD]: -1,
                    })
                ).toThrow(InvalidResourceAmountError);
            });
        });
    });

    describe('get', () => {
        it('returns the amount of a specific resource', () => {
            const bundle = ResourceBundleMother.someWood(5);

            expect(bundle.get(ResourceType.WOOD)).toBe(5);
        });

        it('returns 0 for resources not in the bundle', () => {
            const bundle = ResourceBundleMother.oneWood();

            expect(bundle.get(ResourceType.BRICK)).toBe(0);
        });
    });

    describe('add', () => {
        it('adds resources and returns a new bundle', () => {
            const bundle1 = ResourceBundleMother.someWood(2);
            const bundle2 = ResourceBundleMother.someWood(3);

            const result = bundle1.add(bundle2);

            expect(result.get(ResourceType.WOOD)).toBe(5);
        });

        it('combines different resource types', () => {
            const bundle1 = ResourceBundle.of({ [ResourceType.WOOD]: 2 });
            const bundle2 = ResourceBundle.of({ [ResourceType.BRICK]: 3 });

            const result = bundle1.add(bundle2);

            expect(result.get(ResourceType.WOOD)).toBe(2);
            expect(result.get(ResourceType.BRICK)).toBe(3);
        });

        it('does not mutate the original bundles', () => {
            const bundle1 = ResourceBundleMother.someWood(2);
            const bundle2 = ResourceBundleMother.someWood(3);

            bundle1.add(bundle2);

            expect(bundle1.get(ResourceType.WOOD)).toBe(2);
            expect(bundle2.get(ResourceType.WOOD)).toBe(3);
        });
    });

    describe('deduct', () => {
        let bundle: ResourceBundle;

        beforeEach(() => {
            bundle = ResourceBundle.of({
                [ResourceType.WOOD]: 5,
                [ResourceType.BRICK]: 3,
            });
        });

        it('deducts resources and returns a new bundle', () => {
            const toDeduct = ResourceBundle.of({ [ResourceType.WOOD]: 2 });

            const result = bundle.deduct(toDeduct);

            expect(result.get(ResourceType.WOOD)).toBe(3);
            expect(result.get(ResourceType.BRICK)).toBe(3);
        });

        it('removes resource type when amount reaches zero', () => {
            const toDeduct = ResourceBundle.of({ [ResourceType.WOOD]: 5 });

            const result = bundle.deduct(toDeduct);

            expect(result.get(ResourceType.WOOD)).toBe(0);
        });

        describe('when insufficient resources', () => {
            it('throws InsufficientResourcesError', () => {
                const toDeduct = ResourceBundle.of({ [ResourceType.WOOD]: 10 });

                expect(() => bundle.deduct(toDeduct)).toThrow(InsufficientResourcesError);
            });

            it('includes error context', () => {
                const toDeduct = ResourceBundle.of({ [ResourceType.WOOD]: 10 });

                try {
                    bundle.deduct(toDeduct);
                    expect.fail('Should have thrown InsufficientResourcesError');
                } catch (error) {
                    const e = error as InsufficientResourcesError;
                    expect(e.resourceType).toBe(ResourceType.WOOD);
                    expect(e.required).toBe(10);
                    expect(e.available).toBe(5);
                }
            });
        });

        it('does not mutate the original bundle', () => {
            const toDeduct = ResourceBundle.of({ [ResourceType.WOOD]: 2 });

            bundle.deduct(toDeduct);

            expect(bundle.get(ResourceType.WOOD)).toBe(5);
        });
    });

    describe('has', () => {
        let bundle: ResourceBundle;

        beforeEach(() => {
            bundle = ResourceBundle.of({
                [ResourceType.WOOD]: 5,
                [ResourceType.BRICK]: 3,
            });
        });

        it('returns true when bundle has sufficient resources', () => {
            const required = ResourceBundle.of({ [ResourceType.WOOD]: 3 });

            expect(bundle.has(required)).toBe(true);
        });

        it('returns true when bundle has exact amount', () => {
            const required = ResourceBundle.of({ [ResourceType.WOOD]: 5 });

            expect(bundle.has(required)).toBe(true);
        });

        it('returns false when bundle lacks resources', () => {
            const required = ResourceBundle.of({ [ResourceType.WOOD]: 10 });

            expect(bundle.has(required)).toBe(false);
        });

        it('returns false when resource type is missing', () => {
            const required = ResourceBundle.of({ [ResourceType.SHEEP]: 1 });

            expect(bundle.has(required)).toBe(false);
        });

        it('checks multiple resource types', () => {
            const required = ResourceBundle.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 2,
            });

            expect(bundle.has(required)).toBe(true);
        });
    });

    describe('total', () => {
        it('returns the sum of all resources', () => {
            const bundle = ResourceBundle.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
                [ResourceType.SHEEP]: 1,
            });

            expect(bundle.total()).toBe(6);
        });

        it('returns 0 for empty bundle', () => {
            const bundle = ResourceBundle.empty();

            expect(bundle.total()).toBe(0);
        });
    });

    describe('equals', () => {
        it('returns true when bundles have identical resources', () => {
            const bundle1 = ResourceBundle.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
            });
            const bundle2 = ResourceBundle.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
            });

            expect(bundle1.equals(bundle2)).toBe(true);
        });

        it('returns false when bundles have different amounts', () => {
            const bundle1 = ResourceBundle.of({ [ResourceType.WOOD]: 2 });
            const bundle2 = ResourceBundle.of({ [ResourceType.WOOD]: 3 });

            expect(bundle1.equals(bundle2)).toBe(false);
        });

        it('returns false when bundles have different resource types', () => {
            const bundle1 = ResourceBundle.of({ [ResourceType.WOOD]: 2 });
            const bundle2 = ResourceBundle.of({ [ResourceType.BRICK]: 2 });

            expect(bundle1.equals(bundle2)).toBe(false);
        });

        it('returns true for two empty bundles', () => {
            const bundle1 = ResourceBundle.empty();
            const bundle2 = ResourceBundle.empty();

            expect(bundle1.equals(bundle2)).toBe(true);
        });
    });
});
