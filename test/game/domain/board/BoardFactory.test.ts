import { beforeEach, describe, expect, it } from 'vitest';
import { BoardFactory } from '#game/domain/board/BoardFactory';
import { HexCoordinate } from '#game/domain/shared/coordinate/HexCoordinate';
import { ResourceType } from '#game/domain/shared/ResourceType';

let factory: BoardFactory;

describe('BoardFactory', () => {
    beforeEach(() => {
        factory = new BoardFactory();
    });

    describe('create', () => {
        it('creates a board with 19 tiles', () => {
            const board = factory.create();

            expect(board.getAllTiles()).toHaveLength(19);
        });

        it('places a desert tile at the center', () => {
            const board = factory.create();
            const centerTile = board.getTile(HexCoordinate.of(0, 0));

            expect(centerTile).toBeDefined();
            expect(centerTile?.resourceType).toBe(ResourceType.DESERT);
        });

        it('places tiles in the first ring', () => {
            const board = factory.create();
            const firstRingCoordinates = [
                HexCoordinate.of(1, 0),
                HexCoordinate.of(1, -1),
                HexCoordinate.of(0, -1),
                HexCoordinate.of(-1, 0),
                HexCoordinate.of(-1, 1),
                HexCoordinate.of(0, 1),
            ];

            for (const coord of firstRingCoordinates) {
                const tile = board.getTile(coord);
                expect(tile).toBeDefined();
            }
        });

        it('places tiles in the second ring', () => {
            const board = factory.create();
            const secondRingCoordinates = [
                HexCoordinate.of(2, 0),
                HexCoordinate.of(2, -1),
                HexCoordinate.of(2, -2),
                HexCoordinate.of(1, -2),
                HexCoordinate.of(0, -2),
                HexCoordinate.of(-1, -1),
                HexCoordinate.of(-2, 0),
                HexCoordinate.of(-2, 1),
                HexCoordinate.of(-2, 2),
                HexCoordinate.of(-1, 2),
                HexCoordinate.of(0, 2),
                HexCoordinate.of(1, 1),
            ];

            for (const coord of secondRingCoordinates) {
                const tile = board.getTile(coord);
                expect(tile).toBeDefined();
            }
        });

        it('creates a board with various resource types', () => {
            const board = factory.create();
            const tiles = board.getAllTiles();
            const resourceTypes = new Set(tiles.map((tile) => tile.resourceType));

            expect(resourceTypes.size).toBeGreaterThan(1);
            expect(resourceTypes.has(ResourceType.DESERT)).toBe(true);
            expect(resourceTypes.has(ResourceType.WOOD)).toBe(true);
            expect(resourceTypes.has(ResourceType.BRICK)).toBe(true);
        });
    });
});
