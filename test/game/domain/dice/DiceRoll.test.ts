import { describe, it, expect } from 'vitest';
import { DiceRoll } from '#game/domain/dice/DiceRoll';

describe('DiceRoll', () => {
    describe('of', () => {
        it('creates a DiceRoll with correct rolls and total', () => {
            const rolls = [2, 5, 3];
            const diceRoll = DiceRoll.of(rolls);
            expect(diceRoll.rolls).toEqual([2, 5, 3]);
            expect(diceRoll.total).toBe(10);
        });
    });

    describe('equals', () => {
        it('returns true for equal DiceRolls', () => {
            const a = DiceRoll.of([1, 2, 3]);
            const b = DiceRoll.of([1, 2, 3]);
            expect(a.equals(b)).toBe(true);
        });

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
