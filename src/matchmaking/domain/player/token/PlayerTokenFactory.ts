import type { HashingService } from './HashingService';
import { PlayerToken } from './PlayerToken';
import { PlayerTokenPrefix } from './PlayerTokenPrefix';
import { PlayerTokenGenerator } from './PlayerTokenGenerator';
import { RawPlayerToken } from './RawPlayerToken';

export type GeneratePlayerTokenResult = {
    rawToken: RawPlayerToken;
    token: PlayerToken;
};

/**
 * Factory responsible for generating new `PlayerToken` instances.
 */
export class PlayerTokenFactory {
    private readonly _hashingService: HashingService;
    private readonly _playerTokenGenerator: PlayerTokenGenerator;

    constructor(hashingService: HashingService, playerTokenGenerator: PlayerTokenGenerator) {
        this._hashingService = hashingService;
        this._playerTokenGenerator = playerTokenGenerator;
    }

    /**
     * Generates a new player token.
     *
     * - Produces 64 random hex chars as the raw token.
     * - Derives an 8-char prefix from the first 8 chars.
     * - Hashes the raw token via `HashingService`.
     * - Returns a `PlayerToken` with `rawValue` set (one-time access for the client).
     *
     * @returns {PlayerToken} The fully populated token.
     */
    generate(): GeneratePlayerTokenResult {
        const rawToken = this._playerTokenGenerator.generate();
        const prefix = new PlayerTokenPrefix(rawToken.value.slice(0, 8));
        const hash = this._hashingService.hash(rawToken);
        return { rawToken: rawToken, token: new PlayerToken(prefix, hash) };
    }
}
