import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { playerStatusFromString } from '#matchmaking/domain/player/PlayerStatus';
import { PlayerToken } from '#matchmaking/domain/player/token/PlayerToken';
import { PlayerTokenHash } from '#matchmaking/domain/player/token/PlayerTokenHash';
import { PlayerTokenPrefix } from '#matchmaking/domain/player/token/PlayerTokenPrefix';
import { InMemoryPlayer } from './InMemoryPlayer';

export class InMemoryPlayerMapper {
    static toInMemory(player: Player): InMemoryPlayer {
        return new InMemoryPlayer(
            player.id.value,
            player.publicKey.value,
            player.token.prefix.value,
            player.token.hash.value,
            player.name,
            player.status.toString()
        );
    }

    static toDomain(imPlayer: InMemoryPlayer): Player {
        const token = new PlayerToken(
            new PlayerTokenPrefix(imPlayer.tokenPrefix),
            new PlayerTokenHash(imPlayer.tokenHash)
        );
        return new Player(
            new PlayerId(imPlayer.id),
            new PlayerId(imPlayer.publicKey),
            token,
            imPlayer.name,
            playerStatusFromString(imPlayer.status)
        );
    }
}
