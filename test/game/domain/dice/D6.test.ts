import { describe, it, expect } from 'vitest';
import { D6 } from '#game/domain/dice/D6';

describe('D6', () => {
    describe('roll', () => {
        it('returns a value between 1 and 6', () => {
            const die = D6.create();
            for (let i = 0; i < 100; i++) {
                const { total } = die.roll();
                expect(total).toBeGreaterThanOrEqual(1);
                expect(total).toBeLessThanOrEqual(6);
            }
        });
    });
});
