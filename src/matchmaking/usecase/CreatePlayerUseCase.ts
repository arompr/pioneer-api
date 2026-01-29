import type { Player } from '../domain/player/Player.ts';
import type { PlayerFactory } from '../domain/player/PlayerFactory.ts';

/**
 * Use Case responsible for creating a new Player.
 */
export class CreatePlayer {
    private readonly playerFactory: PlayerFactory;

    constructor(playerFactory: PlayerFactory) {
        this.playerFactory = playerFactory;
    }

    execute(name: string): Player {
        return this.playerFactory.create(name);
    }
}
