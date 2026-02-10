import { DomainError } from '#common/domain/DomainError';
import { Tile } from '#game/domain/tile/Tile';

export class TileAlreadyExistsError extends DomainError {
    public readonly tile: Tile;

    constructor(tile: Tile) {
        super(`Tile already placed at coordinates: ${tile.coordinates.toString()}`);
        this.tile = tile;
    }
}
