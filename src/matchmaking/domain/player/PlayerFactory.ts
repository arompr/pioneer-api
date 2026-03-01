import { PlayerIdFactory } from '#common/domain/player/playerId/PlayerIdFactory';
import { Player } from './Player';
import { PlayerStatus } from './PlayerStatus';

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
        return new Player(this.playerIdFactory.generate(), name, PlayerStatus.Pending);
    }
}
