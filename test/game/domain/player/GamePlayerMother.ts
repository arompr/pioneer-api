import { GamePlayer } from '#game/domain/player/GamePlayer';
import { PlayerColor } from '#game/domain/player/PlayerColor';
import { ResourceBundle } from '#game/domain/player/ResourceBundle';
import { ResourceType } from '#game/domain/shared/ResourceType';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

/**
 * Object Mother for GamePlayer test fixtures.
 */
export class GamePlayerMother {
    /**
     * Creates a basic game player with default values.
     */
    static anyPlayer(): GamePlayer {
        return this.create(1, PlayerColor.RED);
    }

    /**
     * Creates a game player with a specific index and color.
     *
     * @param {number} index - The player index.
     * @param {PlayerColor} color - The player's color.
     * @returns {GamePlayer} A new GamePlayer instance.
     */
    static create(index: number, color: PlayerColor): GamePlayer {
        return new GamePlayer(new PlayerId(`player-${index}`), color);
    }

    /**
     * Creates a game player with resources.
     *
     * @param {number} index - The player index.
     * @param {PlayerColor} color - The player's color.
     * @param {ResourceBundle} resources - Initial resources.
     * @returns {GamePlayer} A GamePlayer with resources.
     */
    static withResources(index: number, color: PlayerColor, resources: ResourceBundle): GamePlayer {
        const player = this.create(index, color);
        player.addResources(resources);
        return player;
    }

    /**
     * Creates a game player with buildings.
     */
    static withBuildings(index: number, color: PlayerColor): GamePlayer {
        const player = this.create(index, color);
        player.buildSettlement();
        player.buildSettlement();
        player.buildRoad();
        player.buildRoad();
        player.buildRoad();
        return player;
    }

    /**
     * Creates a game player close to winning (9 victory points).
     */
    static almostWinning(): GamePlayer {
        const player = this.create(1, PlayerColor.RED);
        player.addVictoryPoints(9);
        return player;
    }

    /**
     * Creates multiple game players with different colors.
     *
     * @param {number} count - The number of players to create.
     * @returns {GamePlayer[]} An array of GamePlayers.
     */
    static createMany(count: number): GamePlayer[] {
        const colors = [PlayerColor.RED, PlayerColor.BLUE, PlayerColor.WHITE, PlayerColor.ORANGE];
        return Array.from({ length: count }, (_, i) =>
            this.create(i + 1, colors[i % colors.length])
        );
    }

    /**
     * Creates a game player with specific resource amounts.
     */
    static withSpecificResources(wood = 0, brick = 0, sheep = 0, wheat = 0, ore = 0): GamePlayer {
        const player = this.anyPlayer();
        const resources = ResourceBundle.of({
            [ResourceType.WOOD]: wood,
            [ResourceType.BRICK]: brick,
            [ResourceType.SHEEP]: sheep,
            [ResourceType.WHEAT]: wheat,
            [ResourceType.ORE]: ore,
        });
        player.addResources(resources);
        return player;
    }
}
