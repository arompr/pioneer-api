import { Player } from '#game/domain/player/Player';
import { PlayerColor } from '#game/domain/player/PlayerColor';
import { ResourceBundle } from '#game/domain/player/ResourceBundle';
import { ResourceType } from '#game/domain/shared/ResourceType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

/**
 * Object Mother for Player test fixtures.
 */
export class PlayerMother {
    /**
     * Creates a basic player with default values.
     */
    static anyPlayer(): Player {
        return this.create(1, PlayerColor.RED);
    }

    /**
     * Creates a player with a specific index and color.
     *
     * @param {number} index - The player index.
     * @param {PlayerColor} color - The player's color.
     * @returns {Player} A new Player instance.
     */
    static create(index: number, color: PlayerColor): Player {
        return new Player(new PlayerId(`player-${index}`), color, ResourceBundle.empty());
    }

    /**
     * Creates a player with resources.
     *
     * @param {number} index - The player index.
     * @param {PlayerColor} color - The player's color.
     * @param {ResourceBundle} resources - Initial resources.
     * @returns {Player} A Player with resources.
     */
    static withResources(index: number, color: PlayerColor, resources: ResourceBundle): Player {
        const player = this.create(index, color);
        player.addResources(resources);
        return player;
    }

    /**
     * Creates multiple players with different colors.
     *
     * @param {number} count - The number of players to create.
     * @returns {Player[]} An array of Players.
     */
    static createMany(count: number): Player[] {
        const colors = [PlayerColor.RED, PlayerColor.BLUE, PlayerColor.WHITE, PlayerColor.ORANGE];
        return Array.from({ length: count }, (_, i) =>
            this.create(i + 1, colors[i % colors.length])
        );
    }

    /**
     * Creates a player with specific resource quantities.
     */
    static withSpecificResources(wood = 0, brick = 0, sheep = 0, wheat = 0, ore = 0): Player {
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
