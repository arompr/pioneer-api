/**
 * Value object representing the result of rolling one or more dice.
 *
 * @remarks
 * - Immutable.
 * - Use equals() for value comparison.
 */
export class DiceRoll {
    public readonly rolls: number[];
    public readonly total: number;

    private constructor(rolls: number[], total: number) {
        this.rolls = rolls;
        this.total = total;
    }

    /**
     * Creates a new DiceRoll value object.
     * @param rolls - The individual dice roll results.
     * @returns A new {@link DiceRoll} instance
     */
    public static of(rolls: number[]): DiceRoll {
        return new DiceRoll(
            [...rolls],
            rolls.reduce((a, b) => a + b, 0)
        );
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
