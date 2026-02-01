import { v4 as uuidv4 } from 'uuid';
import { LobbyId } from './LobbyId.ts';

/**
 * Factory responsible for generating LobbyId instances.
 */
export class LobbyIdFactory {
    /**
     * Generates a new unique LobbyId.
     *
     * @returns {LobbyId} A new LobbyId instance
     */
    generate(): LobbyId {
        return new LobbyId(uuidv4());
    }
}
