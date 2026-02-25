import { RawPlayerToken } from './RawPlayerToken';

export const PLAYER_TOKEN_GENERATOR = Symbol('PlayerTokenGenerator');

/**
 * Interface for generating secure random player tokens.
 */
export interface PlayerTokenGenerator {
    /**
     * Generates a secure random raw player token.
     * @returns {RawPlayerToken} The token.
     */
    generate(): RawPlayerToken;
}
