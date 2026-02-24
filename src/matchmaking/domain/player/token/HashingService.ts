import type { PlayerTokenHash } from './PlayerTokenHash';
import { RawPlayerToken } from './RawPlayerToken';

export const HASHING_SERVICE = Symbol('HashingService');

/**
 * Domain interface for hashing player tokens.
 * Implemented in the infrastructure layer.
 */
export interface HashingService {
    /**
     * Hashes a raw token value and returns the stored hash.
     *
     * @param {RawPlayerToken} value - The raw token to hash.
     * @returns {PlayerTokenHash} The hashed token in `"salt:hash"` format.
     */
    hash(value: RawPlayerToken): PlayerTokenHash;

    /**
     * Verifies a raw token against a stored hash.
     *
     * @param {RawPlayerToken} rawToken - The raw token presented by the client.
     * @param {PlayerTokenHash} hash - The stored hash to verify against.
     * @returns {boolean} `true` if the token matches, `false` otherwise.
     */
    verify(rawToken: RawPlayerToken, hash: PlayerTokenHash): boolean;
}
