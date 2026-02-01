import type { HexCoordinate } from './coordinate/HexCoordinate.ts';
import type { Distance } from './distance/Distance.ts';

export class Tile {
    private readonly coordinates: HexCoordinate;

    constructor(coordinates: HexCoordinate) {
        this.coordinates = coordinates;
    }

    /**
     * Calculates the distance from this tile to another tile.
     *
     * @param other - The target `Tile` to which the distance is calculated
     * @returns The number of hexes between this tile and the `other` tile
     */
    public distanceTo(other: Tile): Distance {
        return this.coordinates.distanceTo(other.coordinates);
    }
}
