import { describe, expect, it, beforeEach } from 'vitest';
import BoardTiles from './BoardTiles';
import Tile from '../tile/Tile';
import HexCoordinate from '../coordinate/HexCoordinate';
import { RessourceType } from '../tile/RessourceType';
import TileAlreadyExistsError from './errors/TileAlreadyExistsError';

describe('BoardTiles', () => {
    describe('creation', () => {
        describe('when given an empty set of tiles', () => {
            it('boardTiles has no tiles', () => {
                const boardTiles = new BoardTiles([]);
                expect(boardTiles.getAll()).toEqual([]);
            });
        });

        describe('when given a set of tiles', () => {
            it('boardTiles has exactly those tiles', () => {
                const tiles = [
                    new Tile(HexCoordinate.of(0, 0), RessourceType.BRICK),
                    new Tile(HexCoordinate.of(0, 1), RessourceType.DESERT),
                ];

                const boardTiles = new BoardTiles(tiles);

                expect(boardTiles.getAll()).toEqual(tiles);
            });
        });
    });

    describe('add()', () => {
        let boardTiles: BoardTiles;
        const ORIGIN_COORDINATES = HexCoordinate.of(0, 0);
        beforeEach(() => {
            const tiles = [new Tile(ORIGIN_COORDINATES, RessourceType.BRICK)];
            boardTiles = new BoardTiles(tiles);
        });

        describe('when adding a new tile', () => {
            it('the tile is added', () => {
                const coordinates = HexCoordinate.of(0, 3);
                const newTile = new Tile(coordinates, RessourceType.BRICK);

                boardTiles.add(newTile);

                expect(boardTiles.getFromCoordinates(coordinates)).toBeDefined();
                expect(boardTiles.getFromCoordinates(coordinates)).toEqual(newTile);
            });
        });

        describe('when adding a tile at the same position as an existing one', () => {
            it('throws TileAlreadyExistsError', () => {
                expect(() =>
                    boardTiles.add(new Tile(ORIGIN_COORDINATES, RessourceType.ORE))
                ).toThrow(TileAlreadyExistsError);
            });

            it(`the tile isn't added`, () => {
                const originalTile = new Tile(HexCoordinate.of(5, 5), RessourceType.SHEEP);
                const duplicateCoordinatesTile = new Tile(ORIGIN_COORDINATES, RessourceType.ORE);

                try {
                    boardTiles.add(duplicateCoordinatesTile);
                } catch (_error) {
                    // do nothing
                }

                const tile = boardTiles.getFromCoordinates(ORIGIN_COORDINATES);
                expect(tile).toEqual(originalTile);
            });
        });
    });

    // 2. add(tile)
    // Happy path
    //
    // should add a tile when it does not already exist
    //
    // After add(tile), has(tile) is true
    //
    // get(tile) returns the same tile instance
    //
    // Error cases
    //
    // should throw TileAlreadyExistsError when adding a tile with existing coordinates
    //
    // Map already contains a tile with the same (q, r, s)
    //
    // add(tile) throws TileAlreadyExistsError
    //
    // Side-effect safety
    //
    // should not modify the tiles map when TileAlreadyExistsError is thrown
    //
    // Size remains unchanged
    //
    // Existing tile remains unchanged
});
