import { describe, it, expect } from 'vitest';
import { Board } from './Board';
import BoardTiles from './BoardTiles';
import Tile from '../tile/Tile';
import HexCoordinate from '../coordinate/HexCoordinate';
import TileNotFoundError from './errors/TileNotFoundError';
import { TileMother } from '#test/game/domain/tile/TileMother';

const TILE1: Tile = TileMother.aTile(2, 0);
const TILE2: Tile = TileMother.aTile(1, 0);
const TILES = [TILE1, TILE2];

describe('Board', () => {
    describe('addTile(tile)', () => {
        it('should add a tile to the board', () => {
            const emptyBoardTiles = new BoardTiles();
            const board = new Board(emptyBoardTiles);
            const newTile = TileMother.aTile(5, 5);

            board.addTile(newTile);

            const retrievedTile = board.getTile(newTile.coordinates);
            expect(retrievedTile).toBeDefined();
            expect(retrievedTile).toBe(newTile);
        });
    });

    describe('getTile(tile)', () => {
        it('should return the tile at the given coordinates', () => {
            const boardTiles = new BoardTiles([TILE1, TILE2]);
            const board = new Board(boardTiles);

            const retrieved = board.getTile(TILE1.coordinates);
            expect(retrieved).toBe(TILE1);
        });

        it('should return undefined for coordinates with no tile', () => {
            const emptyBoardTiles = new BoardTiles();
            const board = new Board(emptyBoardTiles);

            const retrieved = board.getTile(HexCoordinate.of(0, 0));

            expect(retrieved).toBeUndefined();
        });
    });

    describe('getTileOrThrow(tile)', () => {
        it('should return the tile if it exists', () => {
            const boardTiles = new BoardTiles([TILE1, TILE2]);
            const board = new Board(boardTiles);

            const retrieved = board.getTileOrThrow(TILE1.coordinates);

            expect(retrieved).toBe(TILE1);
        });

        it('should throw TileNotFoundError if tile does not exist', () => {
            const emptyBoardTiles = new BoardTiles();
            const board = new Board(emptyBoardTiles);
            expect(() => board.getTileOrThrow(HexCoordinate.of(0, 0))).toThrow(TileNotFoundError);
        });
    });

    describe('getAllTiles()', () => {
        it('should return all tiles added to the board', () => {
            const boardTiles = new BoardTiles([TILE1, TILE2]);
            const board = new Board(boardTiles);

            const allTiles = board.getAllTiles();

            expect(allTiles).toHaveLength(TILES.length);
            expect(allTiles).toContain(TILE1);
            expect(allTiles).toContain(TILE2);
        });

        it('should return an empty array if no tiles exist', () => {
            const emptyBoardTiles = new BoardTiles();
            const board = new Board(emptyBoardTiles);

            const allTiles = board.getAllTiles();

            expect(allTiles).toEqual([]);
        });
    });
});
