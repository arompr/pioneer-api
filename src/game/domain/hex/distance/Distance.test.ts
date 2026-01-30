import { describe, expect, it } from 'vitest';
import { Distance } from './Distance.ts';
import { NegativeDistanceError } from './errors/NegativeDistanceError.ts';

describe('Distance', () => {
    describe('fromHexes()', () => {
        describe('when the value is negative', () => {
            it('throws an error', () => {
                expect(() => Distance.fromHexes(-1)).toThrow(NegativeDistanceError);
            });
        });

        describe('when the value is zero or greater', () => {
            it('creates a distance with the given hex value', () => {
                const distance = Distance.fromHexes(0);
                expect(distance.getHexes()).toBe(0);
            });
        });
    });

    describe('add()', () => {
        describe('when adding two distances', () => {
            it('returns a distance equal to their sum', () => {
                const a = Distance.fromHexes(2);
                const b = Distance.fromHexes(3);

                const result = a.add(b);

                expect(result.getHexes()).toBe(5);
            });
        });
    });

    describe('comparison', () => {
        describe('isLessThan()', () => {
            describe('when the distance is smaller than another distance', () => {
                it('returns true', () => {
                    const smaller = Distance.fromHexes(1);
                    const larger = Distance.fromHexes(2);

                    expect(smaller.isLessThan(larger)).toBe(true);
                });
            });

            describe('when the distances are equal', () => {
                it('returns false', () => {
                    const a = Distance.fromHexes(2);
                    const b = Distance.fromHexes(2);

                    expect(a.isLessThan(b)).toBe(false);
                });
            });
        });

        describe('isGreaterThan()', () => {
            describe('when the distance is larger than another distance', () => {
                it('returns true', () => {
                    const larger = Distance.fromHexes(2);
                    const smaller = Distance.fromHexes(1);

                    expect(larger.isGreaterThan(smaller)).toBe(true);
                });
            });

            describe('when the distances are equal', () => {
                it('returns false', () => {
                    const a = Distance.fromHexes(2);
                    const b = Distance.fromHexes(2);

                    expect(a.isGreaterThan(b)).toBe(false);
                });
            });
        });

        describe('equals()', () => {
            describe('when the distances are equal', () => {
                it('returns true', () => {
                    const a = Distance.fromHexes(2);
                    const b = Distance.fromHexes(2);

                    expect(a.equals(b)).toBe(true);
                });
            });

            describe('when the distances are different', () => {
                it('returns false', () => {
                    const a = Distance.fromHexes(2);
                    const b = Distance.fromHexes(1);

                    expect(a.equals(b)).toBe(false);
                });
            });
        });
    });

    describe('toString()', () => {
        describe('when the distance is one hex', () => {
            it('uses the singular form', () => {
                expect(Distance.fromHexes(1).toString()).toBe('1 hex');
            });
        });

        describe('when the distance is more than one hex', () => {
            it('uses the plural form', () => {
                expect(Distance.fromHexes(2).toString()).toBe('2 hexes');
            });
        });
    });
});
