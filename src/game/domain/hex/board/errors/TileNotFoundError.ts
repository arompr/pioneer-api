import DomainError from '#common/domain/DomainError';
import HexCoordinate from '#game/domain/hex/coordinate/HexCoordinate';

export default class TileNotFoundError extends DomainError {
    public readonly coordinates: HexCoordinate;

    constructor(coordinates: HexCoordinate) {
        super(`Tile not found at coordinates: ${coordinates.toString()}`);
        this.coordinates = coordinates;
    }
}
