import { PlayerIdFactory } from '#common/domain/player/playerId/PlayerIdFactory';
import { Player } from './Player';
import { PlayerStatus } from './PlayerStatus';
import { PlayerTokenFactory } from './token/PlayerTokenFactory';
import { RawPlayerToken } from './token/RawPlayerToken';

export type CreatePlayerResult = {
    rawToken: RawPlayerToken;
    player: Player;
};

/**
 * Factory responsible for creating Player instances.
 */
export class PlayerFactory {
    private readonly _playerIdFactory: PlayerIdFactory;
    private readonly _playerTokenFactory: PlayerTokenFactory;

    constructor(playerIdFactory: PlayerIdFactory, playerTokenFactory: PlayerTokenFactory) {
        this._playerIdFactory = playerIdFactory;
        this._playerTokenFactory = playerTokenFactory;
    }

    /**
     * Creates a new Player.
     */
    create(name: string): CreatePlayerResult {
        const { rawToken, token } = this._playerTokenFactory.generate();
        const player = new Player(
            this._playerIdFactory.generate(),
            this._playerIdFactory.generate(),
            token,
            name,
            PlayerStatus.Pending
        );

        return { rawToken, player };
    }
}
