import HexCoordinate from '../coordinate/HexCoordinate';
import Tile from '../tile/Tile';
import BoardTiles from './BoardTiles';
import TileNotFoundError from './errors/TileNotFoundError';

export class Board {
    private readonly _tiles: BoardTiles;

    constructor(boardTiles: BoardTiles) {
        this._tiles = boardTiles;
    }

    /**
     * Adds a tile to the board.
     * references by identity, not value equality.
     */
    public addTile(tile: Tile): void {
        this._tiles.add(tile);
    }

    public getTileOrThrow(coordinate: HexCoordinate): Tile {
        const tile = this.getTile(coordinate);

        if (!tile) {
            throw new TileNotFoundError(coordinate);
        }

        return tile;
    }

    /**
     * Finds a specific tile at a coordinate.
     */
    public getTile(coordinate: HexCoordinate): Tile | undefined {
        return this._tiles.getFromCoordinates(coordinate);
    }

    public getAllTiles(): readonly Tile[] {
        return this._tiles.getAll();
    }
}
