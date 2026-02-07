import { describe, expect, it, beforeEach } from 'vitest';
import BoardTiles from './BoardTiles';
import Tile from '../tile/Tile';
import HexCoordinate from '../coordinate/HexCoordinate';
import { RessourceType } from '../tile/RessourceType';
import TileAlreadyExistsError from './errors/TileAlreadyExistsError';

const ORIGIN_COORDINATES = HexCoordinate.of(0, 0);
const ORIGIN_TILE: Tile = new Tile(ORIGIN_COORDINATES, RessourceType.ORE);
const TILES = [ORIGIN_TILE];

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

    describe('add(tile)', () => {
        let boardTiles: BoardTiles;
        beforeEach(() => {
            boardTiles = new BoardTiles(TILES);
        });

        describe('when adding a new tile', () => {
            it('the tile is added', () => {
                const coordinates = HexCoordinate.of(0, 3);
                const newTile = new Tile(coordinates, RessourceType.BRICK);

                boardTiles.add(newTile);

                expect(boardTiles.getTile(coordinates)).toBeDefined();
                expect(boardTiles.getTile(coordinates)).toEqual(newTile);
            });
        });

        describe('when adding a tile at the same position as an existing one', () => {
            it('throws TileAlreadyExistsError', () => {
                expect(() =>
                    boardTiles.add(new Tile(ORIGIN_COORDINATES, RessourceType.ORE))
                ).toThrow(TileAlreadyExistsError);
            });

            it(`the tile isn't added`, () => {
                const duplicateOriginTile = new Tile(ORIGIN_COORDINATES, RessourceType.ORE);

                try {
                    boardTiles.add(duplicateOriginTile);
                } catch (_error) {
                    // do nothing
                }

                const tile = boardTiles.getTile(ORIGIN_COORDINATES);
                expect(tile).toEqual(ORIGIN_TILE);
            });
        });
    });

    describe('hasTile(coordinates)', () => {
        let boardTiles: BoardTiles;
        beforeEach(() => {
            boardTiles = new BoardTiles(TILES);
        });

        describe('when a tile with the same coordinates exists', () => {
            it('returns true', () => {
                expect(boardTiles.hasTile(ORIGIN_COORDINATES)).toBe(true);
            });
        });

        describe('when no tile at coordinates exists', () => {
            it('returns false', () => {
                const coordinates = HexCoordinate.of(5, 5);
                expect(boardTiles.hasTile(coordinates)).toBe(false);
            });
        });
    });

    describe('getTile(coordinates)', () => {
        let boardTiles: BoardTiles;

        beforeEach(() => {
            boardTiles = new BoardTiles(TILES);
        });

        describe('when a tile with the given coordinates exists', () => {
            it('returns the tile at those coordinates', () => {
                const tile = boardTiles.getTile(ORIGIN_COORDINATES);

                expect(tile).toBeDefined();
                expect(tile).toEqual(ORIGIN_TILE);
            });
        });

        describe('when no tile at the given coordinates exists', () => {
            it('returns undefined', () => {
                const coordinates = HexCoordinate.of(5, 5);

                const tile = boardTiles.getTile(coordinates);

                expect(tile).toBeUndefined();
            });
        });
    });

    it('treats different coordinate instances with same values as identical', () => {
        const boardTiles = new BoardTiles(TILES);

        const sameCoordinates = HexCoordinate.of(0, 0);
        const duplicateTile = new Tile(sameCoordinates, RessourceType.ORE);

        expect(boardTiles.hasTile(sameCoordinates)).toBe(true);
        expect(() => boardTiles.add(duplicateTile)).toThrow(TileAlreadyExistsError);
        expect(boardTiles.getTile(sameCoordinates)).toEqual(ORIGIN_TILE);
    });
});
