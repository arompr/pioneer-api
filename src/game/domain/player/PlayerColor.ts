/**
 * Value Object representing a player's color in the game.
 */
export class PlayerColor {
    private readonly _value: string;

    private constructor(color: string) {
        this._value = color;
    }

    static RED = new PlayerColor('RED');
    static BLUE = new PlayerColor('BLUE');
    static WHITE = new PlayerColor('WHITE');
    static ORANGE = new PlayerColor('ORANGE');

    /**
     * Returns the string value of the PlayerColor.
     */
    get value(): string {
        return this._value;
    }

    /**
     * Compares this PlayerColor with another for equality.
     *
     * @param {PlayerColor} other - The other color to compare.
     * @returns {boolean} True if the colors are identical.
     */
    equals(other: PlayerColor): boolean {
        return this._value === other._value;
    }
}
