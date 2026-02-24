import type { PlayerTokenHash } from './PlayerTokenHash';
import type { PlayerTokenPrefix } from './PlayerTokenPrefix';

/**
 * Composite value object representing a player's authentication token.
 */
export class PlayerToken {
    private readonly _prefix: PlayerTokenPrefix;
    private readonly _hash: PlayerTokenHash;

    /**
     * @param {PlayerTokenPrefix} prefix - The 8-char hex prefix stored in plaintext.
     * @param {PlayerTokenHash} hash - The `"salt:hash"` output.
     */
    constructor(prefix: PlayerTokenPrefix, hash: PlayerTokenHash) {
        this._prefix = prefix;
        this._hash = hash;
    }

    get prefix(): PlayerTokenPrefix {
        return this._prefix;
    }

    get hash(): PlayerTokenHash {
        return this._hash;
    }

    equals(other: PlayerToken): boolean {
        return this._prefix.equals(other._prefix) && this._hash.equals(other._hash);
    }
}
