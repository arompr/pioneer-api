import { describe, it, expect } from 'vitest';
import { PlayerColor } from '#game/domain/player/PlayerColor';

describe('PlayerColor', () => {
    describe('equals', () => {
        it('returns true when comparing identical colors', () => {
            expect(PlayerColor.RED.equals(PlayerColor.RED)).toBe(true);
        });

        it('returns false when comparing different colors', () => {
            expect(PlayerColor.RED.equals(PlayerColor.BLUE)).toBe(false);
        });
    });

    describe('toString', () => {
        it('returns the color name as string', () => {
            expect(PlayerColor.RED.toString()).toBe('RED');
            expect(PlayerColor.BLUE.toString()).toBe('BLUE');
            expect(PlayerColor.WHITE.toString()).toBe('WHITE');
            expect(PlayerColor.ORANGE.toString()).toBe('ORANGE');
        });
    });

    describe('static instances', () => {
        it('provides predefined color instances', () => {
            expect(PlayerColor.RED).toBeDefined();
            expect(PlayerColor.BLUE).toBeDefined();
            expect(PlayerColor.WHITE).toBeDefined();
            expect(PlayerColor.ORANGE).toBeDefined();
        });
    });
});
