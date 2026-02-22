import { Dice } from './Dice';
import { DiceRoll } from './DiceRoll';

/**
 * Represents a collection of dice and provides methods to roll them.
 *
 * Use {@link Dices.of} to create a set of dice, then call {@link Dices#roll} to roll all dice and get the results.
 */
export class Dices {
    private readonly _dices: Dice[];

    /**
     * Creates a new {@link Dices} instance.
     *
     * This constructor is private. Use {@link Dices.of} to create instances.
     *
     * @param dices - The dice to include in this set.
     */
    private constructor(dices: Dice[]) {
        this._dices = [...dices];
    }

    /**
     * Creates a new {@link Dices} instance from the provided dice.
     *
     * @param dices - The dice to include in this set.
     * @returns A new {@link Dices} instance.
     */
    public static of(dices: Dice[]): Dices {
        return new Dices(dices);
    }

    /**
     * Rolls all dice in this set and returns the individual results and their total.
     *
     * @returns An object containing the array of roll results and their sum.
     */
    public roll(): DiceRoll {
        const diceRolls = this._dices.map((d) => d.roll());
        const rolls = diceRolls.flatMap((r) => r.rolls);
        return DiceRoll.of(rolls);
    }
}
