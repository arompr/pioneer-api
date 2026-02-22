import { describe, it, expect } from 'vitest';
import { Dices } from '#game/domain/dice/Dices';
import { DiceRoll } from '#game/domain/dice/DiceRoll';
import { D6 } from '#game/domain/dice/D6';
import { Dice } from '#game/domain/dice/Dice';

describe('Dices', () => {
    describe('of', () => {
        it('creates a Dices instance with the provided dice', () => {
            const dice: Dice[] = [D6.create(), D6.create()];
            const dices = Dices.of(dice);
            expect(dices).toBeInstanceOf(Dices);
        });
    });

    describe('roll', () => {
        it('rolls all dice and returns correct number of results', () => {
            const diceList: Dice[] = [D6.create(), D6.create(), D6.create()];
            const dices = Dices.of(diceList);
            const result = dices.roll();
            expect(result.rolls.length).toBe(3);
            for (const roll of result.rolls) {
                expect(roll).toBeGreaterThanOrEqual(1);
                expect(roll).toBeLessThanOrEqual(6);
            }
            expect(result.total).toBe(result.rolls.reduce((a, b) => a + b, 0));
        });

        it('returns total as sum of all dice rolls', () => {
            // Use a stub die for deterministic test
            class StubDie implements Dice {
                constructor(private readonly value: number) {}
                roll() {
                    return DiceRoll.of([this.value]);
                }
            }
            const dice: Dice[] = [new StubDie(2), new StubDie(5), new StubDie(3)];
            const dices = Dices.of(dice);
            const result = dices.roll();
            expect(result.rolls).toEqual([2, 5, 3]);
            expect(result.total).toBe(10);
        });
    });
});
