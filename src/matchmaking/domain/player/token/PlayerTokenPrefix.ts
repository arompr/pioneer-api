/**
 * The first 8 hex characters of a player token, stored in plaintext.
 * Used to locate a player record without exposing the full token.
 */
export class PlayerTokenPrefix {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    equals(other: PlayerTokenPrefix): boolean {
        return this._value === other._value;
    }
}
