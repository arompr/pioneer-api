import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';
import { RawPlayerToken } from '#matchmaking/domain/player/token/RawPlayerToken';

export class CreatePlayerDto {
    readonly id: PlayerId;
    readonly rawToken: RawPlayerToken;
    readonly name: string;
    readonly status: PlayerStatus;

    constructor(id: PlayerId, rawToken: RawPlayerToken, name: string, status: PlayerStatus) {
        this.id = id;
        this.rawToken = rawToken;
        this.name = name;
        this.status = status;
    }

    public static of(player: Player, rawToken: RawPlayerToken): CreatePlayerDto {
        return new CreatePlayerDto(player.id, rawToken, player.name, player.status);
    }
}
