import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerId } from './playerId/PlayerId.ts';
import { Player } from './Player.ts';

const DEFAULT_PLAYER_ID = new PlayerId('player-id');
const OTHER_PLAYER_ID = new PlayerId('other-player-id');
const DEFAULT_PLAYER_NAME = 'player-name';
let player: Player;

describe('Player', () => {
    beforeEach(() => {
        player = new Player(DEFAULT_PLAYER_ID, DEFAULT_PLAYER_NAME);
    });

    describe('creation', () => {
        describe('when a player is newly created', () => {
            it('should have the correct id and name', () => {
                expect(player.getPlayerId()).toEqual(DEFAULT_PLAYER_ID);
                expect(player.getName()).toBe(DEFAULT_PLAYER_NAME);
            });

            it('should not be ready', () => {
                expect(player.isReady()).toBe(false);
            });
        });
    });

    describe('markReady()', () => {
        describe('when the player is pending', () => {
            it('should be ready', () => {
                player.markReady();

                expect(player.isReady()).toBe(true);
            });
        });

        describe('when the player is Ready', () => {
            it('remains ready', () => {
                player.markReady();

                expect(player.isReady()).toBe(true);
            });
        });
    });

    describe('markPending()', () => {
        describe('when the player is ready', () => {
            it('should not be ready', () => {
                player.markReady();

                player.markPending();

                expect(player.isReady()).toBe(false);
            });
        });

        describe('when the player is already pending', () => {
            it('remains pending', () => {
                player.markPending();

                expect(player.isReady()).toBe(false);
            });
        });
    });

    describe('equals()', () => {
        describe('when two players have the same PlayerId', () => {
            it('returns true', () => {
                const playerWithSameId = new Player(DEFAULT_PLAYER_ID, DEFAULT_PLAYER_NAME);

                expect(player.equals(playerWithSameId)).toBe(true);
            });
        });

        describe('when two players have different PlayerIds', () => {
            it('returns false', () => {
                const playerWithSameId = new Player(OTHER_PLAYER_ID, DEFAULT_PLAYER_NAME);

                expect(player.equals(playerWithSameId)).toBe(false);
            });
        });
    });
});
