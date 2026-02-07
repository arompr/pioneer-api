import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class PlayerMother {
    static create(index: string | number, ready = false): Player {
        const player = new Player(
            new PlayerId(`secret-${index}`),
            new PlayerId(`public-${index}`),
            `player-${index}`
        );

        if (ready) {
            player.markReady();
        }

        return player;
    }

    static createMany(count: number, readyCount = 0): Player[] {
        return Array.from({ length: count }, (_, i) => this.create(i + 1, i < readyCount));
    }
}
