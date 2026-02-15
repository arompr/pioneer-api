import { HexCoordinate } from '../shared/coordinate/HexCoordinate';
import { ResourceType } from '../shared/ResourceType';
import { Tile } from '../tile/Tile';
import { Board } from './Board';
import { BoardTiles } from './BoardTiles';

/**
 * Factory for creating Board instances.
 */
export class BoardFactory {
    /**
     * Creates a new Board with a hardcoded hexagonal tile layout.
     *
     * The board consists of a standard hexagonal grid with 19 tiles:
     * - 1 tile at the center (0, 0)
     * - 6 tiles in the first ring around the center
     * - 12 tiles in the second ring
     *
     * @returns A new Board instance with tiles placed.
     */
    create(): Board {
        const tiles = this.generateTiles();
        const boardTiles = new BoardTiles(tiles);
        return new Board(boardTiles);
    }

    private generateTiles(): Tile[] {
        return [
            // Center tile
            new Tile(HexCoordinate.of(0, 0), ResourceType.DESERT),

            // First ring (6 tiles)
            new Tile(HexCoordinate.of(1, 0), ResourceType.WOOD),
            new Tile(HexCoordinate.of(1, -1), ResourceType.BRICK),
            new Tile(HexCoordinate.of(0, -1), ResourceType.SHEEP),
            new Tile(HexCoordinate.of(-1, 0), ResourceType.WHEAT),
            new Tile(HexCoordinate.of(-1, 1), ResourceType.ORE),
            new Tile(HexCoordinate.of(0, 1), ResourceType.WOOD),

            // Second ring (12 tiles)
            new Tile(HexCoordinate.of(2, 0), ResourceType.BRICK),
            new Tile(HexCoordinate.of(2, -1), ResourceType.SHEEP),
            new Tile(HexCoordinate.of(2, -2), ResourceType.WHEAT),
            new Tile(HexCoordinate.of(1, -2), ResourceType.ORE),
            new Tile(HexCoordinate.of(0, -2), ResourceType.WOOD),
            new Tile(HexCoordinate.of(-1, -1), ResourceType.BRICK),
            new Tile(HexCoordinate.of(-2, 0), ResourceType.SHEEP),
            new Tile(HexCoordinate.of(-2, 1), ResourceType.WHEAT),
            new Tile(HexCoordinate.of(-2, 2), ResourceType.ORE),
            new Tile(HexCoordinate.of(-1, 2), ResourceType.WOOD),
            new Tile(HexCoordinate.of(0, 2), ResourceType.BRICK),
            new Tile(HexCoordinate.of(1, 1), ResourceType.SHEEP),
        ];
    }
}
