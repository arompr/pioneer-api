import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { playerStatusFromString } from '#matchmaking/domain/player/PlayerStatus';
import { InMemoryPlayer } from './InMemoryPlayer';

export class InMemoryPlayerMapper {
    static toInMemory(player: Player): InMemoryPlayer {
        return new InMemoryPlayer(
            player.id.toString(),
            player.publicKey.toString(),
            player.name,
            player.status.toString()
        );
    }

    static toDomain(imPlayer: InMemoryPlayer): Player {
        return new Player(
            new PlayerId(imPlayer.id),
            new PlayerId(imPlayer.publicKey),
            imPlayer.name,
            playerStatusFromString(imPlayer.status)
        );
    }
}
