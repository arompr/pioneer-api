import { describe, it, expect, beforeEach } from 'vitest';
import { ResourceHand } from '#game/domain/player/ResourceHand';
import { InsufficientResourcesError } from '#game/domain/player/errors/InsufficientResourcesError';
import { InvalidResourceAmountError } from '#game/domain/player/errors/InvalidResourceAmountError';
import { ResourceHandMother } from './ResourceHandMother';
import { ResourceType } from '#game/domain/shared/ResourceType';

describe('ResourceHand', () => {
    describe('empty', () => {
        it('creates an empty resource hand', () => {
            const hand = ResourceHand.empty();

            expect(hand.total()).toBe(0);
            expect(hand.getAmount(ResourceType.WOOD)).toBe(0);
        });
    });

    describe('of', () => {
        it('creates a hand with the specified resources', () => {
            const hand = ResourceHand.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
            });

            expect(hand.getAmount(ResourceType.WOOD)).toBe(2);
            expect(hand.getAmount(ResourceType.BRICK)).toBe(3);
        });

        describe('when amount is negative', () => {
            it('throws InvalidResourceAmountError', () => {
                expect(() =>
                    ResourceHand.of({
                        [ResourceType.WOOD]: -1,
                    })
                ).toThrow(InvalidResourceAmountError);
            });
        });
    });

    describe('get', () => {
        it('returns the amount of a specific resource', () => {
            const hand = ResourceHandMother.someWood(5);

            expect(hand.getAmount(ResourceType.WOOD)).toBe(5);
        });

        it('returns 0 for resources not in the hand', () => {
            const hand = ResourceHandMother.oneWood();

            expect(hand.getAmount(ResourceType.BRICK)).toBe(0);
        });
    });

    describe('add', () => {
        it('adds resources and returns a new hand', () => {
            const hand1 = ResourceHandMother.someWood(2);
            const hand2 = ResourceHandMother.someWood(3);

            const result = hand1.add(hand2);

            expect(result.getAmount(ResourceType.WOOD)).toBe(5);
        });

        it('combines different resource types', () => {
            const hand1 = ResourceHand.of({ [ResourceType.WOOD]: 2 });
            const hand2 = ResourceHand.of({ [ResourceType.BRICK]: 3 });

            const result = hand1.add(hand2);

            expect(result.getAmount(ResourceType.WOOD)).toBe(2);
            expect(result.getAmount(ResourceType.BRICK)).toBe(3);
        });

        it('does not mutate the original hands', () => {
            const hand1 = ResourceHandMother.someWood(2);
            const hand2 = ResourceHandMother.someWood(3);

            hand1.add(hand2);

            expect(hand1.getAmount(ResourceType.WOOD)).toBe(2);
            expect(hand2.getAmount(ResourceType.WOOD)).toBe(3);
        });
    });

    describe('deduct', () => {
        let hand: ResourceHand;

        beforeEach(() => {
            hand = ResourceHand.of({
                [ResourceType.WOOD]: 5,
                [ResourceType.BRICK]: 3,
            });
        });

        it('deducts resources and returns a new hand', () => {
            const toDeduct = ResourceHand.of({ [ResourceType.WOOD]: 2 });

            const result = hand.deduct(toDeduct);

            expect(result.getAmount(ResourceType.WOOD)).toBe(3);
            expect(result.getAmount(ResourceType.BRICK)).toBe(3);
        });

        it('removes resource type when amount reaches zero', () => {
            const toDeduct = ResourceHand.of({ [ResourceType.WOOD]: 5 });

            const result = hand.deduct(toDeduct);

            expect(result.getAmount(ResourceType.WOOD)).toBe(0);
        });

        describe('when insufficient resources', () => {
            it('throws InsufficientResourcesError', () => {
                const toDeduct = ResourceHand.of({ [ResourceType.WOOD]: 10 });

                expect(() => hand.deduct(toDeduct)).toThrow(InsufficientResourcesError);
            });

            it('includes error context', () => {
                const toDeduct = ResourceHand.of({ [ResourceType.WOOD]: 10 });

                try {
                    hand.deduct(toDeduct);
                    expect.fail('Should have thrown InsufficientResourcesError');
                } catch (error) {
                    const e = error as InsufficientResourcesError;
                    expect(e.resourceType).toBe(ResourceType.WOOD);
                    expect(e.required).toBe(10);
                    expect(e.available).toBe(5);
                }
            });
        });

        it('does not mutate the original hand', () => {
            const toDeduct = ResourceHand.of({ [ResourceType.WOOD]: 2 });

            hand.deduct(toDeduct);

            expect(hand.getAmount(ResourceType.WOOD)).toBe(5);
        });
    });

    describe('has', () => {
        let hand: ResourceHand;

        beforeEach(() => {
            hand = ResourceHand.of({
                [ResourceType.WOOD]: 5,
                [ResourceType.BRICK]: 3,
            });
        });

        it('returns true when hand has sufficient resources', () => {
            const required = ResourceHand.of({ [ResourceType.WOOD]: 3 });

            expect(hand.has(required)).toBe(true);
        });

        it('returns true when hand has exact amount', () => {
            const required = ResourceHand.of({ [ResourceType.WOOD]: 5 });

            expect(hand.has(required)).toBe(true);
        });

        it('returns false when hand lacks resources', () => {
            const required = ResourceHand.of({ [ResourceType.WOOD]: 10 });

            expect(hand.has(required)).toBe(false);
        });

        it('returns false when resource type is missing', () => {
            const required = ResourceHand.of({ [ResourceType.SHEEP]: 1 });

            expect(hand.has(required)).toBe(false);
        });

        it('checks multiple resource types', () => {
            const required = ResourceHand.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 2,
            });

            expect(hand.has(required)).toBe(true);
        });
    });

    describe('total', () => {
        it('returns the sum of all resources', () => {
            const hand = ResourceHand.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
                [ResourceType.SHEEP]: 1,
            });

            expect(hand.total()).toBe(6);
        });

        it('returns 0 for empty hand', () => {
            const hand = ResourceHand.empty();

            expect(hand.total()).toBe(0);
        });
    });

    describe('equals', () => {
        it('returns true when hands have identical resources', () => {
            const hand1 = ResourceHand.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
            });
            const hand2 = ResourceHand.of({
                [ResourceType.WOOD]: 2,
                [ResourceType.BRICK]: 3,
            });

            expect(hand1.equals(hand2)).toBe(true);
        });

        it('returns false when hands have different amounts', () => {
            const hand1 = ResourceHand.of({ [ResourceType.WOOD]: 2 });
            const hand2 = ResourceHand.of({ [ResourceType.WOOD]: 3 });

            expect(hand1.equals(hand2)).toBe(false);
        });

        it('returns false when hands have different resource types', () => {
            const hand1 = ResourceHand.of({ [ResourceType.WOOD]: 2 });
            const hand2 = ResourceHand.of({ [ResourceType.BRICK]: 2 });

            expect(hand1.equals(hand2)).toBe(false);
        });

        it('returns true for two empty hands', () => {
            const hand1 = ResourceHand.empty();
            const hand2 = ResourceHand.empty();

            expect(hand1.equals(hand2)).toBe(true);
        });
    });
});
