import { ResourceHand } from '#game/domain/player/ResourceHand';
import { ResourceType } from '#game/domain/shared/ResourceType';

/**
 * Object Mother for ResourceHand test fixtures.
 */
export class ResourceHandMother {
    /**
     * Creates an empty resource hand.
     */
    static empty(): ResourceHand {
        return ResourceHand.empty();
    }

    /**
     * Creates a resource hand with one wood.
     */
    static oneWood(): ResourceHand {
        return ResourceHand.of({ [ResourceType.WOOD]: 1 });
    }

    /**
     * Creates a resource hand with multiple wood.
     */
    static someWood(amount = 3): ResourceHand {
        return ResourceHand.of({ [ResourceType.WOOD]: amount });
    }

    /**
     * Creates a resource hand with a variety of resources.
     */
    static mixed(): ResourceHand {
        return ResourceHand.of({
            [ResourceType.WOOD]: 2,
            [ResourceType.BRICK]: 1,
            [ResourceType.SHEEP]: 3,
            [ResourceType.WHEAT]: 1,
            [ResourceType.ORE]: 2,
        });
    }

    /**
     * Creates a resource hand for building a settlement (wood, brick, sheep, wheat).
     */
    static forSettlement(): ResourceHand {
        return ResourceHand.of({
            [ResourceType.WOOD]: 1,
            [ResourceType.BRICK]: 1,
            [ResourceType.SHEEP]: 1,
            [ResourceType.WHEAT]: 1,
        });
    }

    /**
     * Creates a resource hand for building a road (wood, brick).
     */
    static forRoad(): ResourceHand {
        return ResourceHand.of({
            [ResourceType.WOOD]: 1,
            [ResourceType.BRICK]: 1,
        });
    }

    /**
     * Creates a resource hand for building a city (wheat x2, ore x3).
     */
    static forCity(): ResourceHand {
        return ResourceHand.of({
            [ResourceType.WHEAT]: 2,
            [ResourceType.ORE]: 3,
        });
    }

    /**
     * Creates a resource hand with specific amounts.
     */
    static of(resources: Partial<Record<ResourceType, number>>): ResourceHand {
        return ResourceHand.of(resources);
    }
}
