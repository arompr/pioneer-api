import { EmptyDiceRollError } from './errors/EmptyDiceRollError';
import { InvalidDiceRollValueError } from './errors/InvalidDiceRollValueError';

/**
 * Value object representing the result of rolling one or more dice.
 *
 * @remarks
 * - Immutable.
 * - Use equals() for value comparison.
 * - Validates that rolls array is non-empty and contains only positive integers.
 */
export class DiceRoll {
    public readonly rolls: number[];
    public readonly total: number;

    /**
     * Creates a new DiceRoll value object.
     * @param rolls - The individual dice roll results. Must be non-empty and contain only positive integers.
     * @throws {EmptyDiceRollError} If rolls array is empty.
     * @throws {InvalidDiceRollValueError} If any roll is not a positive integer.
     */
    public constructor(rolls: number[]) {
        if (rolls.length === 0) {
            throw new EmptyDiceRollError();
        }

        for (let i = 0; i < rolls.length; i++) {
            const roll = rolls[i];
            if (!Number.isInteger(roll) || roll <= 0) {
                throw new InvalidDiceRollValueError(i, roll);
            }
        }

        this.rolls = [...rolls];
        this.total = rolls.reduce((a, b) => a + b, 0);
    }

    /**
     * Creates a new DiceRoll value object.
     * @param rolls - The individual dice roll results. Must be non-empty and contain only positive integers.
     * @returns A new {@link DiceRoll} instance
     * @throws {EmptyDiceRollError} If rolls array is empty.
     * @throws {InvalidDiceRollValueError} If any roll is not a positive integer.
     */
    public static of(rolls: number[]): DiceRoll {
        return new DiceRoll(rolls);
    }

    /**
     * Checks value equality with another DiceRoll.
     * @param {DiceRoll} other - Another DiceRoll
     * @returns {boolean} true if rolls and total are equal
     */
    public equals(other: DiceRoll): boolean {
        if (this.total !== other.total) return false;
        if (this.rolls.length !== other.rolls.length) return false;
        for (let i = 0; i < this.rolls.length; i++) {
            if (this.rolls[i] !== other.rolls[i]) return false;
        }
        return true;
    }
}
