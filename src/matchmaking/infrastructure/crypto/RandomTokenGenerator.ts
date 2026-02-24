import { randomBytes } from 'node:crypto';
import { PlayerTokenGenerator } from '#matchmaking/domain/player/token/PlayerTokenGenerator';
import { RawPlayerToken } from '#matchmaking/domain/player/token/RawPlayerToken';

/**
 * Infra implementation of PlayerTokenGenerator using node:crypto.
 */
export class RandomTokenGenerator implements PlayerTokenGenerator {
    generate(): RawPlayerToken {
        const token = randomBytes(32).toString('hex');
        return new RawPlayerToken(token);
    }
}
