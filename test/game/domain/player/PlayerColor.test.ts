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
});
