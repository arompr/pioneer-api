import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '#game/domain/player/Player';
import { PlayerColor } from '#game/domain/player/PlayerColor';
import { ResourceBundle } from '#game/domain/player/ResourceBundle';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { InsufficientResourcesError } from '#game/domain/player/errors/InsufficientResourcesError';
import { PlayerMother } from './PlayerMother';
import { ResourceBundleMother } from './ResourceBundleMother';
import { ResourceType } from '#game/domain/shared/ResourceType';

describe('Player', () => {
    let player: Player;

    beforeEach(() => {
        player = PlayerMother.anyPlayer();
    });

    describe('constructor', () => {
        it('creates a player with id, color and resources', () => {
            const playerId = new PlayerId('test-player');
            const color = PlayerColor.BLUE;
            const resources = ResourceBundle.of({ [ResourceType.WOOD]: 2 });

            const player = new Player(playerId, color, resources);

            expect(player.id).toBe(playerId);
            expect(player.color).toBe(color);
            expect(player.resources).toBe(resources);
        });

        it('initializes with empty resources', () => {
            expect(player.resources.total()).toBe(0);
        });
    });

    describe('addResources', () => {
        it('adds resources to the player', () => {
            const resources = ResourceBundleMother.someWood(3);

            player.addResources(resources);

            expect(player.resources.quantityOf(ResourceType.WOOD)).toBe(3);
        });

        it('accumulates resources over multiple additions', () => {
            player.addResources(ResourceBundleMother.someWood(2));
            player.addResources(ResourceBundleMother.someWood(3));

            expect(player.resources.quantityOf(ResourceType.WOOD)).toBe(5);
        });
    });

    describe('deductResources', () => {
        beforeEach(() => {
            player.addResources(ResourceBundleMother.someWood(5));
        });

        it('deducts resources from the player', () => {
            player.deductResources(ResourceBundleMother.someWood(2));

            expect(player.resources.quantityOf(ResourceType.WOOD)).toBe(3);
        });

        describe('when insufficient resources', () => {
            it('throws InsufficientResourcesError', () => {
                expect(() => player.deductResources(ResourceBundleMother.someWood(10))).toThrow(
                    InsufficientResourcesError
                );
            });
        });
    });

    describe('hasResources', () => {
        beforeEach(() => {
            player.addResources(
                ResourceBundle.of({
                    [ResourceType.WOOD]: 3,
                    [ResourceType.BRICK]: 2,
                })
            );
        });

        it('returns true when player has sufficient resources', () => {
            const required = ResourceBundleMother.someWood(2);

            expect(player.hasResources(required)).toBe(true);
        });

        it('returns false when player lacks resources', () => {
            const required = ResourceBundleMother.someWood(5);

            expect(player.hasResources(required)).toBe(false);
        });

        it('checks multiple resource types', () => {
            const required = ResourceBundle.of({
                [ResourceType.WOOD]: 1,
                [ResourceType.BRICK]: 1,
            });

            expect(player.hasResources(required)).toBe(true);
        });
    });

    describe('equals', () => {
        it('returns true when players have the same id', () => {
            const playerId = new PlayerId('same-id');
            const player1 = new Player(playerId, PlayerColor.RED, ResourceBundle.empty());
            const player2 = new Player(playerId, PlayerColor.BLUE, ResourceBundle.empty());

            expect(player1.equals(player2)).toBe(true);
        });

        it('returns false when players have different ids', () => {
            const playerId = new PlayerId('id');
            const playerId2 = new PlayerId('different-id');
            const player1 = new Player(playerId, PlayerColor.RED, ResourceBundle.empty());
            const player2 = new Player(playerId2, PlayerColor.BLUE, ResourceBundle.empty());

            expect(player1.equals(player2)).toBe(false);
        });
    });
});
