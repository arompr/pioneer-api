import { PlayerIdFactory } from '#common/domain/player/playerId/PlayerIdFactory';
import { Player } from './Player';
import { PlayerStatus } from './PlayerStatus';
import { PlayerToken } from './token/PlayerToken';

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
    create(name: string, token: PlayerToken): Player {
        return new Player(
            this.playerIdFactory.generate(),
            this.playerIdFactory.generate(),
            token,
            name,
            PlayerStatus.Pending
        );
    }
}
