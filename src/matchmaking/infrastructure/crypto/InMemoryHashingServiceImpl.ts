import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { HashingService } from '#matchmaking/domain/player/token/HashingService';
import { PlayerTokenHash } from '#matchmaking/domain/player/token/PlayerTokenHash';
import { RawPlayerToken } from '#matchmaking/domain/player/token/RawPlayerToken';

const SCRYPT_KEY_LENGTH = 32;

/**
 * In-memory implementation of `HashingService` using Node.js built-in `crypto`.
 *
 * Uses `scryptSync` with a random per-token salt.
 * Stored format: `"<saltHex>:<hashHex>"`.
 */
export class InMemoryHashingServiceImpl implements HashingService {
    hash(token: RawPlayerToken): PlayerTokenHash {
        const salt = randomBytes(16);
        const hash = scryptSync(token.value, salt, SCRYPT_KEY_LENGTH);
        return new PlayerTokenHash(`${salt.toString('hex')}:${hash.toString('hex')}`);
    }

    verify(rawToken: RawPlayerToken, storedHash: PlayerTokenHash): boolean {
        const [saltHex, hashHex] = storedHash.value.split(':');
        const salt = Buffer.from(saltHex, 'hex');
        const expected = Buffer.from(hashHex, 'hex');
        const presented = scryptSync(rawToken.value, salt, SCRYPT_KEY_LENGTH);
        return timingSafeEqual(presented, expected);
    }
}
