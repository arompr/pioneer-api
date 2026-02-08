import HexCoordinate from '#game/domain/hex/coordinate/HexCoordinate';
import { ResourceType } from '#game/domain/hex/tile/ResourceType';
import Tile from '#game/domain/hex/tile/Tile';
import { TileBuilder } from './TestTileBuilder';

/** Test mother for Tile domain objects. */
export class TileMother {
    /** Returns a tile at the origin (0,0,0) with a default resource type. */
    public static originTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(0, 0))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile East of the origin (1,0,-1) with a default resource type. */
    public static eastOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(1, 0))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile NorthEast of origin (1,-1,0) with a default resource type.*/
    public static northEastOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(1, -1))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile NorthWest of origin (0,-1,1) with a default resource type. */
    public static northWestOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(0, -1))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile West of origin (-1,0,1) with a default resource type. */
    public static westOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(-1, 0))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile SouthWest of origin (-1,1,0) with a default resource type. */
    public static southWestOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(-1, 1))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile SouthEast of origin (0,1,-1) with a default resource type. */
    public static southEastOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(0, 1))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile. */
    public static aTile(q: number, r: number): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(q, r))
            .withResourceType(ResourceType.WOOD)
            .build();
    }
}
