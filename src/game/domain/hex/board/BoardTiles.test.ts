import { describe, expect, it } from 'vitest';
import BoardTiles from './BoardTiles';
import Tile from '../tile/Tile';
import HexCoordinate from '../coordinate/HexCoordinate';
import { RessourceType } from '../tile/RessourceType';

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
});
