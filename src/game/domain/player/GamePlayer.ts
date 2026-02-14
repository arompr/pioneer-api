import type { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { PlayerColor } from './PlayerColor';
import { ResourceBundle } from './ResourceBundle';

/**
 * Represents a player in the game with their resources, buildings, and victory points.
 */
export class GamePlayer {
    private readonly _id: PlayerId;
    private readonly _color: PlayerColor;
    private _resources: ResourceBundle;
    private _settlementsCount: number;
    private _citiesCount: number;
    private _roadsCount: number;
    private _developmentCardsCount: number;
    private _victoryPoints: number;

    /**
     * Creates a new GamePlayer instance.
     *
     * @param {PlayerId} id - Unique identifier for the player.
     * @param {PlayerColor} color - The player's color.
     */
    constructor(id: PlayerId, color: PlayerColor) {
        this._id = id;
        this._color = color;
        this._resources = ResourceBundle.empty();
        this._settlementsCount = 0;
        this._citiesCount = 0;
        this._roadsCount = 0;
        this._developmentCardsCount = 0;
        this._victoryPoints = 0;
    }

    /**
     * Accessor for the player's id.
     *
     * @returns {PlayerId} The unique identifier of the player.
     */
    get id(): PlayerId {
        return this._id;
    }

    /**
     * Accessor for the player's color.
     *
     * @returns {PlayerColor} The player's color.
     */
    get color(): PlayerColor {
        return this._color;
    }

    /**
     * Accessor for the player's resources.
     *
     * @returns {ResourceBundle} The player's current resources.
     */
    get resources(): ResourceBundle {
        return this._resources;
    }

    /**
     * Accessor for the player's settlements count.
     *
     * @returns {number} The number of settlements built.
     */
    get settlementsCount(): number {
        return this._settlementsCount;
    }

    /**
     * Accessor for the player's cities count.
     *
     * @returns {number} The number of cities built.
     */
    get citiesCount(): number {
        return this._citiesCount;
    }

    /**
     * Accessor for the player's roads count.
     *
     * @returns {number} The number of roads built.
     */
    get roadsCount(): number {
        return this._roadsCount;
    }

    /**
     * Accessor for the player's development cards count.
     *
     * @returns {number} The number of development cards held.
     */
    get developmentCardsCount(): number {
        return this._developmentCardsCount;
    }

    /**
     * Accessor for the player's victory points.
     *
     * @returns {number} The player's current victory points.
     */
    get victoryPoints(): number {
        return this._victoryPoints;
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
     * Builds a settlement, incrementing the settlements count.
     */
    buildSettlement(): void {
        this._settlementsCount++;
    }

    /**
     * Builds a city, incrementing the cities count and decrementing settlements.
     */
    buildCity(): void {
        this._citiesCount++;
        this._settlementsCount--;
    }

    /**
     * Builds a road, incrementing the roads count.
     */
    buildRoad(): void {
        this._roadsCount++;
    }

    /**
     * Adds a development card to the player's hand.
     */
    addDevelopmentCard(): void {
        this._developmentCardsCount++;
    }

    /**
     * Uses a development card, decrementing the count.
     */
    useDevelopmentCard(): void {
        this._developmentCardsCount--;
    }

    /**
     * Adds victory points to the player.
     *
     * @param {number} points - The number of points to add.
     */
    addVictoryPoints(points: number): void {
        this._victoryPoints += points;
    }

    /**
     * Compares this player with another player.
     *
     * @param {GamePlayer} other - The other player to compare.
     * @returns {boolean} True if the players are the same entity.
     */
    equals(other: GamePlayer): boolean {
        return this._id.equals(other.id);
    }
}
