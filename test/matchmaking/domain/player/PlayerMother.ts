import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';

export class PlayerMother {
    static anyPlayer(): Player {
        return this.create(1);
    }

    static create(index: string | number, ready = false): Player {
        const player = new Player(
            new PlayerId(`secret-${index}`),
            new PlayerId(`public-${index}`),
            `player-${index}`,
            ready ? PlayerStatus.Ready : PlayerStatus.Pending
        );

        return player;
    }

    static createMany(count: number, readyCount = 0): Player[] {
        return Array.from({ length: count }, (_, i) => this.create(i + 1, i < readyCount));
    }
}
