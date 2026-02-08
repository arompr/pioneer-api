import HexCoordinate from '../coordinate/HexCoordinate';
import Tile from '../tile/Tile';
import TileAlreadyExistsError from './errors/TileAlreadyExistsError';

type TileKey = `${number},${number},${number}`;

/**
 * Collection of tiles indexed by their hex coordinates.
 *
 * Tiles are uniquely identified by their cube coordinates (q, r, s).
 */
export default class BoardTiles {
    private readonly _tiles: Map<TileKey, Tile>;

    /**
     * Creates a new tile collection, optionally pre-filled with tiles.
     *
     * @param tiles - Initial tiles to add to the board.
     */
    constructor(tiles: Tile[] = []) {
        this._tiles = new Map<TileKey, Tile>();

        for (const tile of tiles) {
            const key = this.toTileKey(tile.coordinates);
            this._tiles.set(key, tile);
        }
    }

    /**
     * Adds a tile to the board.
     *
     * @param tile - The tile to add.
     * @throws {TileAlreadyExistsError}
     * Thrown if a tile with the same coordinates already exists on the board.
     */
    public add(tile: Tile) {
        if (this.hasTile(tile.coordinates)) {
            throw new TileAlreadyExistsError(tile);
        }

        this.set(tile);
    }

    /**
     * Checks whether a tile exists at the given coordinates.
     *
     * @param coordinates - The hex coordinates to check.
     * @returns `true` if a tile with the given coordinates exists, otherwise `false`.
     */
    public hasTile(coordinates: HexCoordinate) {
        const key = this.toTileKey(coordinates);
        return this._tiles.has(key);
    }

    /**
     * Returns all tiles currently on the board.
     *
     * @returns A readonly array of all tiles.
     */
    public getAll(): readonly Tile[] {
        return Array.from(this._tiles.values());
    }

    /**
     * Retrieves the tile at the given coordinates.
     *
     * @param coordinates - The hex coordinates of the tile.
     * @returns The tile at the given coordinates, or `undefined` if none exists.
     */
    public getTile(coordinates: HexCoordinate) {
        return this.getByKey(this.toTileKey(coordinates));
    }

    private getByKey(key: TileKey): Tile | undefined {
        return this._tiles.get(key);
    }

    private set(tile: Tile) {
        const key = this.toTileKey(tile.coordinates);
        this._tiles.set(key, tile);
    }

    private toTileKey(coordinates: HexCoordinate): TileKey {
        return `${coordinates.q},${coordinates.r},${coordinates.s}`;
    }
}
