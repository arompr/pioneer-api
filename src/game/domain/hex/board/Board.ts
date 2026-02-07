import HexCoordinate from '../coordinate/HexCoordinate';
import Tile from '../tile/Tile';
import BoardTiles from './BoardTiles';
import TileNotFoundError from './errors/TileNotFoundError';

export class Board {
    private readonly _tiles: BoardTiles;

    /**
     * Creates a board backed by the given tile collection.
     *
     * @param boardTiles - Tile storage used by the board.
     */
    constructor(boardTiles: BoardTiles) {
        this._tiles = boardTiles;
    }

    /**
     * Adds a tile to the board.
     *
     * @param tile - The tile to add.
     */
    public addTile(tile: Tile): void {
        this._tiles.add(tile);
    }

    /**
     * Returns the tile at the given coordinate or throws if none exists.
     *
     * @param coordinates - The coordinate of the tile.
     * @throws {TileNotFoundError} If no tile exists at the coordinate.
     */
    public getTileOrThrow(coordinates: HexCoordinate): Tile {
        const tile = this.getTile(coordinates);

        if (!tile) {
            throw new TileNotFoundError(coordinates);
        }

        return tile;
    }

    /**
     * Returns the tile at the given coordinates.
     *
     * @param coordinates - The coordinate of the tile.
     */
    public getTile(coordinates: HexCoordinate): Tile | undefined {
        return this._tiles.getTile(coordinates);
    }

    /**
     * Returns all tiles on the board.
     */
    public getAllTiles(): readonly Tile[] {
        return this._tiles.getAll();
    }
}
