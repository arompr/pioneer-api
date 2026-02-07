import type HexCoordinate from '../coordinate/HexCoordinate';
import type Distance from '../distance/Distance';
import { RessourceType as ResourceType } from './RessourceType';

export default class Tile {
    private readonly _coordinates: HexCoordinate;
    private readonly _resourceType: ResourceType;

    constructor(coordinates: HexCoordinate, resourceType: ResourceType) {
        this._coordinates = coordinates;
        this._resourceType = resourceType;
    }

    /**
     * Calculates the distance from this tile to another tile.
     *
     * @param target - The target Tile to which the distance is calculated
     * @returns The number of hexes between this tile and the `other` tile
     */
    public distanceTo(target: Tile): Distance {
        return this._coordinates.distanceTo(target._coordinates);
    }

    public get resourceType(): ResourceType {
        return this._resourceType;
    }

    public get coordinates(): HexCoordinate {
        return this._coordinates;
    }
}
