import HexCoordinate from '#game/domain/hex/coordinate/HexCoordinate';
import { ResourceType } from '#game/domain/hex/tile/ResourceType';
import Tile from '#game/domain/hex/tile/Tile';

export class TileBuilder {
    private _coordinates: HexCoordinate = HexCoordinate.of(0, 0);
    private _resourceType: ResourceType = ResourceType.WOOD;

    /**
     * Override the coordinates of the Tile.
     * @param coordinates - The coordinates to set
     */
    public withCoordinates(coordinates: HexCoordinate): TileBuilder {
        this._coordinates = coordinates;
        return this;
    }

    /**
     * Override the resource type of the Tile.
     * @param resourceType - The resource type to set
     */
    public withResourceType(resourceType: ResourceType): TileBuilder {
        this._resourceType = resourceType;
        return this;
    }

    /**
     * Builds a new Tile instance with the configured properties.
     */
    public build(): Tile {
        return new Tile(this._coordinates, this._resourceType);
    }
}
