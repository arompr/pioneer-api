import { describe, expect, it } from 'vitest';
import { LobbyJoinRules, LobbyStartRules } from '#matchmaking/domain/lobby/LobbyRules';

describe('LobbyStartRules', () => {
    describe('equals', () => {
        describe('when both rules have the same minPlayers', () => {
            it('returns true', () => {
                const a = new LobbyStartRules(2);
                const b = new LobbyStartRules(2);

                expect(a.equals(b)).toBe(true);
            });
        });

        describe('when rules have different minPlayers', () => {
            it('returns false', () => {
                const a = new LobbyStartRules(2);
                const b = new LobbyStartRules(3);

                expect(a.equals(b)).toBe(false);
            });
        });
    });
});

describe('LobbyJoinRules', () => {
    describe('equals', () => {
        describe('when both rules have the same minPlayers and maxPlayers', () => {
            it('returns true', () => {
                const a = new LobbyJoinRules(2, 4);
                const b = new LobbyJoinRules(2, 4);

                expect(a.equals(b)).toBe(true);
            });
        });

        describe('when rules have different minPlayers', () => {
            it('returns false', () => {
                const a = new LobbyJoinRules(2, 4);
                const b = new LobbyJoinRules(3, 4);

                expect(a.equals(b)).toBe(false);
            });
        });

        describe('when rules have different maxPlayers', () => {
            it('returns false', () => {
                const a = new LobbyJoinRules(2, 4);
                const b = new LobbyJoinRules(2, 5);

                expect(a.equals(b)).toBe(false);
            });
        });
    });

    describe('inheritance', () => {
        it('is assignable to LobbyStartRules', () => {
            const joinRules: LobbyStartRules = new LobbyJoinRules(2, 4);

            expect(joinRules.minPlayers).toBe(2);
        });
    });
});
