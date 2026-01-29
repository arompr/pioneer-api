import { Player } from './Player.ts';
import type { PlayerIdFactory } from './playerId/PlayerIdFactory.ts';

/**
 * Factory responsible for creating Player instances.
 */
export class PlayerFactory {
    private readonly playerIdFactory: PlayerIdFactory;

    constructor(playerIdFactory: PlayerIdFactory) {
        this.playerIdFactory = playerIdFactory;
    }
    /**
     * Creates a new Player.
     */
    create(name: string): Player {
        return new Player(this.playerIdFactory.generate(), name);
    }
}
