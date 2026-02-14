import { ResourceBundle } from '#game/domain/player/ResourceBundle';
import { ResourceType } from '#game/domain/shared/ResourceType';

/**
 * Object Mother for ResourceBundle test fixtures.
 */
export class ResourceBundleMother {
    /**
     * Creates an empty resource bundle.
     */
    static empty(): ResourceBundle {
        return ResourceBundle.empty();
    }

    /**
     * Creates a resource bundle with one wood.
     */
    static oneWood(): ResourceBundle {
        return ResourceBundle.of({ [ResourceType.WOOD]: 1 });
    }

    /**
     * Creates a resource bundle with multiple wood.
     */
    static someWood(amount = 3): ResourceBundle {
        return ResourceBundle.of({ [ResourceType.WOOD]: amount });
    }

    /**
     * Creates a resource bundle with a variety of resources.
     */
    static mixed(): ResourceBundle {
        return ResourceBundle.of({
            [ResourceType.WOOD]: 2,
            [ResourceType.BRICK]: 1,
            [ResourceType.SHEEP]: 3,
            [ResourceType.WHEAT]: 1,
            [ResourceType.ORE]: 2,
        });
    }

    /**
     * Creates a resource bundle for building a settlement (wood, brick, sheep, wheat).
     */
    static forSettlement(): ResourceBundle {
        return ResourceBundle.of({
            [ResourceType.WOOD]: 1,
            [ResourceType.BRICK]: 1,
            [ResourceType.SHEEP]: 1,
            [ResourceType.WHEAT]: 1,
        });
    }

    /**
     * Creates a resource bundle for building a road (wood, brick).
     */
    static forRoad(): ResourceBundle {
        return ResourceBundle.of({
            [ResourceType.WOOD]: 1,
            [ResourceType.BRICK]: 1,
        });
    }

    /**
     * Creates a resource bundle for building a city (wheat x2, ore x3).
     */
    static forCity(): ResourceBundle {
        return ResourceBundle.of({
            [ResourceType.WHEAT]: 2,
            [ResourceType.ORE]: 3,
        });
    }

    /**
     * Creates a resource bundle with specific amounts.
     */
    static of(resources: Partial<Record<ResourceType, number>>): ResourceBundle {
        return ResourceBundle.of(resources);
    }
}
