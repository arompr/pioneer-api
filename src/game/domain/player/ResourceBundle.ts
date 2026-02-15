import { ResourceType } from '../shared/ResourceType';
import { InsufficientResourcesError } from './errors/InsufficientResourcesError';
import { InvalidResourceQuantityError } from './errors/InvalidResourceQuantityError';

/**
 * Value Object representing a bundle of resources.
 *
 * Supports add, deduct, and has operations for managing player resources.
 */
export class ResourceBundle {
    private readonly _resources: Map<ResourceType, number>;

    private constructor(resources: Map<ResourceType, number>) {
        this._resources = resources;
    }

    /**
     * Creates an empty ResourceBundle.
     */
    static empty(): ResourceBundle {
        return new ResourceBundle(new Map());
    }

    /**
     * Creates a ResourceBundle with the specified resources.
     *
     * @param {Partial<Record<ResourceType, number>>} resources - Initial resources.
     * @throws {InvalidResourceQuantityError} If any quantity is negative.
     */
    static of(resources: Partial<Record<ResourceType, number>>): ResourceBundle {
        const entries = Object.entries(resources);
        this.requireValidResourceQuantity(entries);

        const resourceMap = new Map<ResourceType, number>(
            entries.map(([type, quantity]) => [type as ResourceType, quantity])
        );

        return new ResourceBundle(resourceMap);
    }

    private static requireValidResourceQuantity(entries: [string, number][]) {
        entries.forEach(([_, quantity]) => {
            if (quantity !== undefined && quantity < 0) {
                throw new InvalidResourceQuantityError(quantity);
            }
        });
    }

    /**
     * Adds resources to this bundle and returns a new ResourceBundle.
     *
     * @param {ResourceBundle} other - The resources to add.
     * @returns {ResourceBundle} A new ResourceBundle with the combined resources.
     */
    add(other: ResourceBundle): ResourceBundle {
        const newResources = new Map(this._resources);

        for (const [type, quantity] of other._resources.entries()) {
            const currentQuantity = this.quantityOf(type);
            newResources.set(type, currentQuantity + quantity);
        }

        return new ResourceBundle(newResources);
    }

    /**
     * Deducts resources from this bundle and returns a new ResourceBundle.
     *
     * @param {ResourceBundle} other - The resources to deduct.
     * @returns {ResourceBundle} A new ResourceBundle with the resources deducted.
     * @throws {InsufficientResourcesError} If any resource is insufficient.
     */
    deduct(other: ResourceBundle): ResourceBundle {
        this.requireSufficientResources(this, other);

        const newResources = new Map(this._resources);
        for (const [type, quantity] of other._resources.entries()) {
            const currentQuantity = newResources.get(type) ?? 0;
            const remaining = currentQuantity - quantity;
            newResources.set(type, remaining);
        }

        return new ResourceBundle(newResources);
    }

    private requireSufficientResources(available: ResourceBundle, required: ResourceBundle): void {
        for (const [type, requiredQuantity] of required._resources.entries()) {
            const currentQuantity = available.quantityOf(type);
            if (currentQuantity < requiredQuantity) {
                throw new InsufficientResourcesError(type, requiredQuantity, currentQuantity);
            }
        }
    }

    /**
     * Checks if this bundle has at least the specified resources.
     *
     * @param {ResourceBundle} other - The resources to check.
     * @returns {boolean} True if this bundle has sufficient resources.
     */
    has(other: ResourceBundle): boolean {
        return Array.from(other._resources.entries()).every(
            ([type, quantity]) => this.quantityOf(type) >= quantity
        );
    }

    /**
     * Returns the total count of all resources.
     *
     * @returns {number} The total resource count.
     */
    total(): number {
        return Array.from(this._resources.values()).reduce((sum, quantity) => sum + quantity, 0);
    }

    /**
     * Returns the quantity of a specific resource.
     *
     * @param {ResourceType} type - The resource type.
     * @returns {number} The quantity of the resource.
     */
    public quantityOf(type: ResourceType): number {
        return this._resources.get(type) ?? 0;
    }

    /**
     * Compares this ResourceBundle with another for equality.
     *
     * @param {ResourceBundle} other - The other bundle to compare.
     * @returns {boolean} True if both bundles have identical resources.
     */
    equals(other: ResourceBundle): boolean {
        if (this._resources.size !== other._resources.size) {
            return false;
        }

        return Array.from(other._resources.entries()).every(
            ([type, quantity]) => this.quantityOf(type) === quantity
        );
    }
}
