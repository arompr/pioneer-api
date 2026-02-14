import type { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { PlayerColor } from './PlayerColor';
import { ResourceBundle } from './ResourceBundle';

/**
 * Represents a player in the game.
 */
export class Player {
    private readonly _id: PlayerId;
    private readonly _color: PlayerColor;
    private _resources: ResourceBundle;

    /**
     * Creates a new Player instance.
     *
     * @param {PlayerId} id - Unique identifier for the player.
     * @param {PlayerColor} color - The player's color.
     * @param {ResourceBundle} resources - The player's resources.
     */
    constructor(id: PlayerId, color: PlayerColor, resources: ResourceBundle) {
        this._id = id;
        this._color = color;
        this._resources = resources;
    }

    /**
     * Returns the player's id.
     *
     * @returns {PlayerId} The unique identifier of the player.
     */
    get id(): PlayerId {
        return this._id;
    }

    /**
     * Returns the player's color.
     *
     * @returns {PlayerColor} The player's color.
     */
    get color(): PlayerColor {
        return this._color;
    }

    /**
     * Returns the player's resources.
     *
     * @returns {ResourceBundle} The player's current resources.
     */
    get resources(): ResourceBundle {
        return this._resources;
    }

    /**
     * Adds resources to the player's resource bundle.
     *
     * @param {ResourceBundle} resources - The resources to add.
     */
    addResources(resources: ResourceBundle): void {
        this._resources = this._resources.add(resources);
    }

    /**
     * Deducts resources from the player's resource bundle.
     *
     * @param {ResourceBundle} resources - The resources to deduct.
     * @throws {InsufficientResourcesError} If the player doesn't have enough resources.
     */
    deductResources(resources: ResourceBundle): void {
        this._resources = this._resources.deduct(resources);
    }

    /**
     * Checks if the player has the specified resources.
     *
     * @param {ResourceBundle} resources - The resources to check.
     * @returns {boolean} True if the player has sufficient resources.
     */
    hasResources(resources: ResourceBundle): boolean {
        return this._resources.has(resources);
    }

    /**
     * Compares this player with another player.
     *
     * @param {Player} other - The other player to compare.
     * @returns {boolean} True if the players are the same entity.
     */
    equals(other: Player): boolean {
        return this._id.equals(other.id);
    }
}
