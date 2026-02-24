import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';
import { PlayerToken } from '#matchmaking/domain/player/token/PlayerToken';
import { PlayerTokenHash } from '#matchmaking/domain/player/token/PlayerTokenHash';
import { PlayerTokenPrefix } from '#matchmaking/domain/player/token/PlayerTokenPrefix';

/** Stub token used in test fixtures. Not cryptographically valid — do not call verify(). */
const STUB_TOKEN = new PlayerToken(
    new PlayerTokenPrefix('00000000'),
    new PlayerTokenHash('00000000:' + '00'.repeat(32))
);

export class PlayerMother {
    static anyPlayer(): Player {
        return this.create(1);
    }

    static create(index: string | number, ready = false): Player {
        const player = new Player(
            new PlayerId(`secret-${index}`),
            new PlayerId(`public-${index}`),
            STUB_TOKEN,
            `player-${index}`,
            ready ? PlayerStatus.Ready : PlayerStatus.Pending
        );

        return player;
    }

    static createMany(count: number, readyCount = 0): Player[] {
        return Array.from({ length: count }, (_, i) => this.create(i + 1, i < readyCount));
    }
}
