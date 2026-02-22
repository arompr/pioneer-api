import { describe, it, expect } from 'vitest';
import { DiceRoll } from '#game/domain/dice/DiceRoll';
import { EmptyDiceRollError } from '#game/domain/dice/errors/EmptyDiceRollError';
import { InvalidDiceRollValueError } from '#game/domain/dice/errors/InvalidDiceRollValueError';

describe('DiceRoll', () => {
    describe('of', () => {
        describe('when creating with valid rolls', () => {
            it('creates a DiceRoll with correct rolls and total', () => {
                const rolls = [2, 5, 3];
                const diceRoll = DiceRoll.of(rolls);
                expect(diceRoll.rolls).toEqual([2, 5, 3]);
                expect(diceRoll.total).toBe(10);
            });

            it('creates a DiceRoll with one roll value', () => {
                const diceRoll = DiceRoll.of([4]);
                expect(diceRoll.rolls).toEqual([4]);
                expect(diceRoll.total).toBe(4);
            });
        });

        describe('when provided an empty rolls array', () => {
            it('throws EmptyDiceRollError', () => {
                expect(() => DiceRoll.of([])).toThrow(EmptyDiceRollError);
            });
        });

        describe('when provided negative roll values', () => {
            it('throws InvalidDiceRollValueError', () => {
                expect(() => DiceRoll.of([-1])).toThrow(InvalidDiceRollValueError);
            });

            it('throws InvalidDiceRollValueError with the correct index and value', () => {
                try {
                    DiceRoll.of([1, -2, 3]);
                    expect.fail('Should have thrown InvalidDiceRollValueError');
                } catch (error) {
                    expect(error).toBeInstanceOf(InvalidDiceRollValueError);
                    expect((error as InvalidDiceRollValueError).index).toBe(1);
                    expect((error as InvalidDiceRollValueError).value).toBe(-2);
                }
            });
        });

        describe('when provided zero roll values', () => {
            it('throws InvalidDiceRollValueError', () => {
                expect(() => DiceRoll.of([0])).toThrow(InvalidDiceRollValueError);
            });

            it('throws InvalidDiceRollValueError with the correct index and value', () => {
                try {
                    DiceRoll.of([0]);
                    expect.fail('Should have thrown InvalidDiceRollValueError');
                } catch (error) {
                    expect(error).toBeInstanceOf(InvalidDiceRollValueError);
                    expect((error as InvalidDiceRollValueError).index).toBe(0);
                    expect((error as InvalidDiceRollValueError).value).toBe(0);
                }
            });
        });

        describe('when provided non-integer roll values', () => {
            it('throws InvalidDiceRollValueError for decimal numbers', () => {
                expect(() => DiceRoll.of([2.5])).toThrow(InvalidDiceRollValueError);
            });

            it('throws InvalidDiceRollValueError with the correct index and value', () => {
                try {
                    DiceRoll.of([1, 2.5, 3]);
                    expect.fail('Should have thrown InvalidDiceRollValueError');
                } catch (error) {
                    expect(error).toBeInstanceOf(InvalidDiceRollValueError);
                    expect((error as InvalidDiceRollValueError).index).toBe(1);
                    expect((error as InvalidDiceRollValueError).value).toBe(2.5);
                }
            });

            it('throws InvalidDiceRollValueError for values that are technically numbers but not integers', () => {
                expect(() => DiceRoll.of([1.0, 2.1])).toThrow(InvalidDiceRollValueError);
            });
        });
    });

    describe('equals', () => {
        describe('when comparing equal DiceRolls', () => {
            it('returns true', () => {
                const a = DiceRoll.of([1, 2, 3]);
                const b = DiceRoll.of([1, 2, 3]);
                expect(a.equals(b)).toBe(true);
            });

            it('returns true for single roll DiceRolls with same value', () => {
                const a = DiceRoll.of([5]);
                const b = DiceRoll.of([5]);
                expect(a.equals(b)).toBe(true);
            });
        });

        describe('when comparing different DiceRolls', () => {
            it('returns false for different rolls', () => {
                const a = DiceRoll.of([1, 2, 3]);
                const b = DiceRoll.of([3, 2, 1]);
                expect(a.equals(b)).toBe(false);
            });

            it('returns false for different totals', () => {
                const a = DiceRoll.of([1, 2, 3]);
                const b = DiceRoll.of([1, 2, 4]);
                expect(a.equals(b)).toBe(false);
            });

            it('returns false for different lengths', () => {
                const a = DiceRoll.of([1, 2, 3]);
                const b = DiceRoll.of([1, 2]);
                expect(a.equals(b)).toBe(false);
            });
        });
    });
});
