import { describe, it, expect } from 'vitest';
import HexCoordinate from './HexCoordinate';
import { Direction } from '../Direction';
import Distance from '../distance/Distance';

describe('HexCoordinate', () => {
    describe('of()', () => {
        describe('when creating a coordinate', () => {
            it('assigns the correct q, r, and s values', () => {
                const coordinate = HexCoordinate.of(1, 2);

                expect(coordinate.q).toBe(1);
                expect(coordinate.r).toBe(2);
                expect(coordinate.s).toBe(-3);
            });
        });
    });

    describe('distanceTo()', () => {
        describe('when calculating distance between two coordinates', () => {
            it('returns the correct distance', () => {
                const a = HexCoordinate.of(0, 0);
                const b = HexCoordinate.of(2, -1);
                const expectedDistance = Distance.fromHexes(2);

                const distance = a.distanceTo(b);

                expect(distance.equals(expectedDistance)).toBe(true);
            });
        });
    });

    describe('neighbors()', () => {
        describe('when retrieving all neighbors', () => {
            it('returns exactly six neighbors', () => {
                const coordinate = HexCoordinate.of(0, 0);

                const neighbors = coordinate.neighbors();

                expect(neighbors).toHaveLength(6);
            });
        });

        describe('when retrieving a neighbor in a specific direction', () => {
            it('returns the correct neighboring coordinate', () => {
                const coordinate = HexCoordinate.of(0, 0);

                const eastNeighbor = coordinate.neighbor(Direction.EAST);

                expect(eastNeighbor.equals(HexCoordinate.of(1, 0))).toBe(true);
            });
        });
    });

    describe('equals()', () => {
        describe('when coordinates have the same q and r values', () => {
            it('considers them equal', () => {
                const a = HexCoordinate.of(0, 0);
                const b = HexCoordinate.of(0, 0);

                expect(a.equals(b)).toBe(true);
            });
        });

        describe('when coordinates have different q or r values', () => {
            it('considers them not equal', () => {
                const a = HexCoordinate.of(0, 0);
                const b = HexCoordinate.of(1, 0);

                expect(a.equals(b)).toBe(false);
            });
        });
    });
});
