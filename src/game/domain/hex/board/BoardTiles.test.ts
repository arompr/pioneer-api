import { describe, expect, it, beforeEach } from 'vitest';
import BoardTiles from './BoardTiles';
import Tile from '../tile/Tile';
import HexCoordinate from '../coordinate/HexCoordinate';
import { ResourceType } from '../tile/ResourceType';
import TileAlreadyExistsError from './errors/TileAlreadyExistsError';
import { TileMother } from '#test/game/domain/tile/TileMother';

const TILE1: Tile = TileMother.aTile(2, 0);
const TILE2: Tile = TileMother.aTile(1, 0);
const TILES = [TILE1, TILE2];

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
                const boardTiles = new BoardTiles(TILES);
                expect(boardTiles.getAll()).toEqual(TILES);
            });
        });
    });

    describe('add(tile)', () => {
        describe('when adding a new tile', () => {
            it('the tile is added', () => {
                const coordinates = HexCoordinate.of(0, 3);
                const newTile = new Tile(coordinates, ResourceType.BRICK);
                const boardTiles = new BoardTiles([]);

                boardTiles.add(newTile);

                expect(boardTiles.getTile(coordinates)).toBeDefined();
                expect(boardTiles.getTile(coordinates)).toEqual(newTile);
            });
        });

        describe('when adding a tile at the same position as an existing one', () => {
            it('throws TileAlreadyExistsError', () => {
                const boardTiles = new BoardTiles(TILES);
                expect(() => boardTiles.add(new Tile(TILE1.coordinates, ResourceType.ORE))).toThrow(
                    TileAlreadyExistsError
                );
            });

            it(`the tile isn't added`, () => {
                const boardTiles = new BoardTiles(TILES);
                const duplicateTile = new Tile(TILE1.coordinates, ResourceType.ORE);

                try {
                    boardTiles.add(duplicateTile);
                } catch (_error) {
                    // do nothing
                }

                const tile = boardTiles.getTile(TILE1.coordinates);
                expect(tile).toEqual(TILE1);
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
                expect(boardTiles.hasTile(TILE1.coordinates)).toBe(true);
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
                const tile = boardTiles.getTile(TILE1.coordinates);

                expect(tile).toBeDefined();
                expect(tile).toEqual(TILE1);
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

        const existingTileCoordinates = TILE1.coordinates;
        const duplicateTile = new Tile(existingTileCoordinates, ResourceType.WOOD);

        expect(boardTiles.hasTile(existingTileCoordinates)).toBe(true);
        expect(() => boardTiles.add(duplicateTile)).toThrow(TileAlreadyExistsError);
        expect(boardTiles.getTile(existingTileCoordinates)).toEqual(TILE1);
    });
});
