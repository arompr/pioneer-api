import { describe, it, expect, beforeEach } from 'vitest';
import { GamePlayer } from '#game/domain/player/GamePlayer';
import { PlayerColor } from '#game/domain/player/PlayerColor';
import { ResourceBundle } from '#game/domain/player/ResourceBundle';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { InsufficientResourcesError } from '#game/domain/player/errors/InsufficientResourcesError';
import { GamePlayerMother } from './GamePlayerMother';
import { ResourceBundleMother } from './ResourceBundleMother';
import { ResourceType } from '#game/domain/shared/ResourceType';

describe('GamePlayer', () => {
    let player: GamePlayer;

    beforeEach(() => {
        player = GamePlayerMother.anyPlayer();
    });

    describe('constructor', () => {
        it('creates a player with id and color', () => {
            const playerId = new PlayerId('test-player');
            const color = PlayerColor.BLUE;
            const gamePlayer = new GamePlayer(playerId, color);

            expect(gamePlayer.id).toBe(playerId);
            expect(gamePlayer.color).toBe(color);
        });

        it('initializes with empty resources', () => {
            expect(player.resources.total()).toBe(0);
        });

        it('initializes with zero buildings', () => {
            expect(player.settlementsCount).toBe(0);
            expect(player.citiesCount).toBe(0);
            expect(player.roadsCount).toBe(0);
        });

        it('initializes with zero development cards', () => {
            expect(player.developmentCardsCount).toBe(0);
        });

        it('initializes with zero victory points', () => {
            expect(player.victoryPoints).toBe(0);
        });
    });

    describe('addResources', () => {
        it('adds resources to the player', () => {
            const resources = ResourceBundleMother.someWood(3);

            player.addResources(resources);

            expect(player.resources.get(ResourceType.WOOD)).toBe(3);
        });

        it('accumulates resources over multiple additions', () => {
            player.addResources(ResourceBundleMother.someWood(2));
            player.addResources(ResourceBundleMother.someWood(3));

            expect(player.resources.get(ResourceType.WOOD)).toBe(5);
        });
    });

    describe('deductResources', () => {
        beforeEach(() => {
            player.addResources(ResourceBundleMother.someWood(5));
        });

        it('deducts resources from the player', () => {
            player.deductResources(ResourceBundleMother.someWood(2));

            expect(player.resources.get(ResourceType.WOOD)).toBe(3);
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

    describe('buildSettlement', () => {
        it('increments settlements count', () => {
            player.buildSettlement();

            expect(player.settlementsCount).toBe(1);
        });

        it('allows multiple settlements', () => {
            player.buildSettlement();
            player.buildSettlement();

            expect(player.settlementsCount).toBe(2);
        });
    });

    describe('buildCity', () => {
        beforeEach(() => {
            player.buildSettlement();
        });

        it('increments cities count', () => {
            player.buildCity();

            expect(player.citiesCount).toBe(1);
        });

        it('decrements settlements count', () => {
            player.buildCity();

            expect(player.settlementsCount).toBe(0);
        });
    });

    describe('buildRoad', () => {
        it('increments roads count', () => {
            player.buildRoad();

            expect(player.roadsCount).toBe(1);
        });

        it('allows multiple roads', () => {
            player.buildRoad();
            player.buildRoad();
            player.buildRoad();

            expect(player.roadsCount).toBe(3);
        });
    });

    describe('addDevelopmentCard', () => {
        it('increments development cards count', () => {
            player.addDevelopmentCard();

            expect(player.developmentCardsCount).toBe(1);
        });

        it('allows multiple development cards', () => {
            player.addDevelopmentCard();
            player.addDevelopmentCard();

            expect(player.developmentCardsCount).toBe(2);
        });
    });

    describe('useDevelopmentCard', () => {
        beforeEach(() => {
            player.addDevelopmentCard();
            player.addDevelopmentCard();
        });

        it('decrements development cards count', () => {
            player.useDevelopmentCard();

            expect(player.developmentCardsCount).toBe(1);
        });
    });

    describe('addVictoryPoints', () => {
        it('adds victory points to the player', () => {
            player.addVictoryPoints(3);

            expect(player.victoryPoints).toBe(3);
        });

        it('accumulates victory points', () => {
            player.addVictoryPoints(2);
            player.addVictoryPoints(3);

            expect(player.victoryPoints).toBe(5);
        });
    });

    describe('equals', () => {
        it('returns true when comparing the same player', () => {
            const other = player;

            expect(player.equals(other)).toBe(true);
        });

        it('returns true when players have the same id', () => {
            const playerId = new PlayerId('same-id');
            const player1 = new GamePlayer(playerId, PlayerColor.RED);
            const player2 = new GamePlayer(playerId, PlayerColor.BLUE);

            expect(player1.equals(player2)).toBe(true);
        });

        it('returns false when players have different ids', () => {
            const player1 = GamePlayerMother.create(1, PlayerColor.RED);
            const player2 = GamePlayerMother.create(2, PlayerColor.RED);

            expect(player1.equals(player2)).toBe(false);
        });
    });

    describe('integration scenarios', () => {
        it('builds a settlement after acquiring resources', () => {
            player.addResources(ResourceBundleMother.forSettlement());

            expect(player.hasResources(ResourceBundleMother.forSettlement())).toBe(true);

            player.deductResources(ResourceBundleMother.forSettlement());
            player.buildSettlement();

            expect(player.settlementsCount).toBe(1);
            expect(player.resources.total()).toBe(0);
        });

        it('builds a city after acquiring resources', () => {
            player.buildSettlement();
            player.addResources(ResourceBundleMother.forCity());

            player.deductResources(ResourceBundleMother.forCity());
            player.buildCity();

            expect(player.citiesCount).toBe(1);
            expect(player.settlementsCount).toBe(0);
        });

        it('builds a road after acquiring resources', () => {
            player.addResources(ResourceBundleMother.forRoad());

            player.deductResources(ResourceBundleMother.forRoad());
            player.buildRoad();

            expect(player.roadsCount).toBe(1);
        });
    });
});
