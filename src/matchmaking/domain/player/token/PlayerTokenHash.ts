/**
 * The scrypt-hashed form of a player token, stored as `"<saltHex>:<hashHex>"`.
 */
export class PlayerTokenHash {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    equals(other: PlayerTokenHash): boolean {
        return this._value === other._value;
    }
}
