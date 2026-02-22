import { Dice, DiceRoll } from './Dice';

/**
 * Represents a standard six-sided die (d6) with face values from 1 to 6.
 *
 * Use {@link D6.create} to create a random die. This implementation does not support fixed-value dice.
 */
export class D6 implements Dice {
    private readonly MIN_VALUE = 1;
    private readonly MAX_VALUE = 6;

    /**
     * Creates a new {@link D6} instance.
     *
     * This constructor is private. Use {@link D6.create} to create instances.
     */
    private constructor() {}

    /**
     * Creates a new {@link D6} instance that produces a random value on each roll.
     *
     * @returns A new {@link D6} instance.
     */
    public static create(): D6 {
        return new D6();
    }

    /**
     * Rolls this die and returns the result.
     *
     * @returns A {@link DiceRoll} with a single roll value between 1 and 6 (inclusive).
     */
    public roll(): DiceRoll {
        const value = Math.floor(Math.random() * this.MAX_VALUE) + this.MIN_VALUE;
        return { rolls: [value], total: value };
    }
}
