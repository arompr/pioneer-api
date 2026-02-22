import { describe, it, expect } from 'vitest';
import { Dices } from '#game/domain/dice/Dices';
import { D6 } from '#game/domain/dice/D6';
import { Dice } from '#game/domain/dice/Dice';
import { EmptyDiceSetError } from '#game/domain/dice/errors/EmptyDiceSetError';

describe('Dices', () => {
    describe('of', () => {
        describe('when dice array is empty', () => {
            it('throws EmptyDiceSetError', () => {
                expect(() => Dices.of([])).toThrow(EmptyDiceSetError);
            });
        });

        describe('when provided with valid dice array', () => {
            it('creates a Dices instance with the provided dice', () => {
                const dice: Dice[] = [D6.create(), D6.create()];
                const dices = Dices.of(dice);
                expect(dices).toBeInstanceOf(Dices);
            });
        });
    });

    describe('roll', () => {
        describe('when rolling all dice', () => {
            it('returns correct number of results', () => {
                const diceList: Dice[] = [D6.create(), D6.create(), D6.create()];
                const dices = Dices.of(diceList);
                const result = dices.roll();
                expect(result.rolls.length).toBe(3);
            });

            it('returns rolls within valid range', () => {
                const diceList: Dice[] = [D6.create(), D6.create(), D6.create()];
                const dices = Dices.of(diceList);
                const result = dices.roll();
                for (const roll of result.rolls) {
                    expect(roll).toBeGreaterThanOrEqual(1);
                    expect(roll).toBeLessThanOrEqual(6);
                }
            });

            it('calculates total as sum of all dice rolls', () => {
                const diceList: Dice[] = [D6.create(), D6.create(), D6.create()];
                const dices = Dices.of(diceList);
                const result = dices.roll();
                expect(result.total).toBe(result.rolls.reduce((a, b) => a + b, 0));
            });
        });
    });
});
