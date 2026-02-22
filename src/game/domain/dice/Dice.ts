export type DiceRoll = { rolls: number[]; total: number };

/**
 * Interface for a die that produces a value when rolled.
 *
 * Implementations must provide a {@link roll} method that returns a {@link DiceRoll}.
 */
export interface Dice {
    /**
     * Rolls this die and returns the resulting value.
     */
    roll(): DiceRoll;
}
