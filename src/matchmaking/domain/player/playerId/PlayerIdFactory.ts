import { v4 as uuidv4 } from 'uuid';
import { PlayerId } from './PlayerId.ts';

/**
 * Factory responsible for generating PlayerId instances.
 */
export class PlayerIdFactory {
    /**
     * Generates a new unique PlayerId.
     *
     * @returns {PlayerId} A new PlayerId instance
     */
    generate(): PlayerId {
        return new PlayerId(uuidv4());
    }
}
