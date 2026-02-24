/**
 * The raw form of a player token.
 */
export class RawPlayerToken {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    equals(other: RawPlayerToken): boolean {
        return this._value === other._value;
    }
}
