import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { playerStatusFromString } from '#matchmaking/domain/player/PlayerStatus';
import { InMemoryPlayer } from './InMemoryPlayer';

export class InMemoryPlayerMapper {
    static toInMemory(player: Player): InMemoryPlayer {
        return new InMemoryPlayer(player.id.value, player.name, player.status.toString());
    }

    static toDomain(imPlayer: InMemoryPlayer): Player {
        return new Player(
            new PlayerId(imPlayer.id),
            imPlayer.name,
            playerStatusFromString(imPlayer.status)
        );
    }
}
