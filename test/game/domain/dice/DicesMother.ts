import { Dices } from '#game/domain/dice/Dices';
import { D6 } from '#game/domain/dice/D6';

/**
 * Object Mother for Dices test fixtures.
 */
export class DicesMother {
    /**
     * Creates a Dices instance with two D6 dice.
     */
    static twoDice(): Dices {
        return Dices.of([D6.create(), D6.create()]);
    }

    /**
     * Creates a Dices instance with a specific number of D6 dice.
     *
     * @param {number} count - The number of D6 dice.
     * @returns {Dices} A new Dices instance.
     */
    static withCount(count: number): Dices {
        return Dices.of(Array.from({ length: count }, () => D6.create()));
    }

    /**
     * Creates a Dices instance with three D6 dice.
     */
    static threeDice(): Dices {
        return Dices.of([D6.create(), D6.create(), D6.create()]);
    }
}
