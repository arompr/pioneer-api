import HexCoordinate from '../coordinate/HexCoordinate';
import Tile from '../tile/Tile';

type TileKey = `${number},${number},${number}`;

export default class BoardTiles {
    private readonly _tiles: Map<TileKey, Tile>;

    constructor(tiles: Map<TileKey, Tile>) {
        this._tiles = tiles;
    }

    public add(tile: Tile) {
        if (this.has(tile)) {
            throw new Error('replace this error');
        }

        this.set(tile);
    }

    public has(tile: Tile) {
        const key = this.toTileKey(tile.coordinates);
        return this._tiles.has(key);
    }

    public getAll(): readonly Tile[] {
        return Array.from(this._tiles.values());
    }

    public get(tile: Tile): Tile | undefined {
        const key = this.toTileKey(tile.coordinates);
        return this._tiles.get(key);
    }

    public getFromCoordinates(coordinates: HexCoordinate) {
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
