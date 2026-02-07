import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerId } from './playerId/PlayerId';
import { Player } from './Player';
import { PlayerStatus } from './PlayerStatus';

const DEFAULT_PLAYER_PUBLIC_ID = new PlayerId('player-public-id');
const DEFAULT_PLAYER_SECRET_ID = new PlayerId('player-secret-id');
const OTHER_PLAYER_PUBLIC_ID = new PlayerId('other-player-id');
const OTHER_PLAYER_SECRET_ID = new PlayerId('other-secret-id');
const PENDING_STATUS = PlayerStatus.Pending;

const DEFAULT_PLAYER_NAME = 'player-name';
let player: Player;

describe('Player', () => {
    beforeEach(() => {
        player = new Player(
            DEFAULT_PLAYER_SECRET_ID,
            DEFAULT_PLAYER_PUBLIC_ID,
            DEFAULT_PLAYER_NAME,
            PENDING_STATUS
        );
    });

    describe('creation', () => {
        describe('when a player is newly created', () => {
            it('should have the correct ids and name', () => {
                expect(player.getSecretId()).toEqual(DEFAULT_PLAYER_SECRET_ID);
                expect(player.getPublicId()).toEqual(DEFAULT_PLAYER_PUBLIC_ID);
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
        describe('when two players have the same secretId', () => {
            it('returns true', () => {
                const playerWithSameId = new Player(
                    DEFAULT_PLAYER_SECRET_ID,
                    DEFAULT_PLAYER_PUBLIC_ID,
                    DEFAULT_PLAYER_NAME,
                    PENDING_STATUS
                );

                expect(player.equals(playerWithSameId)).toBe(true);
            });
        });

        describe('when two players have different secretIds', () => {
            it('returns false', () => {
                const playerWithSameId = new Player(
                    OTHER_PLAYER_SECRET_ID,
                    OTHER_PLAYER_PUBLIC_ID,
                    DEFAULT_PLAYER_NAME,
                    PENDING_STATUS
                );

                expect(player.equals(playerWithSameId)).toBe(false);
            });
        });
    });
});
