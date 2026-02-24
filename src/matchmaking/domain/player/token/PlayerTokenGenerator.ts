import { RawPlayerToken } from './RawPlayerToken';

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
