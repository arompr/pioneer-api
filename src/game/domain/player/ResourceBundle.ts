import { ResourceType } from '../shared/ResourceType';
import { InsufficientResourcesError } from './errors/InsufficientResourcesError';
import { InvalidResourceAmountError } from './errors/InvalidResourceAmountError';

/**
 * Value Object representing a bundle of resources.
 *
 * Supports add, deduct, and has operations for managing player resources.
 */
export class ResourceBundle {
    private readonly resources: Map<ResourceType, number>;

    private constructor(resources: Map<ResourceType, number>) {
        this.resources = resources;
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
     * @throws {InvalidResourceAmountError} If any amount is negative.
     */
    static of(resources: Partial<Record<ResourceType, number>>): ResourceBundle {
        const resourceMap = new Map<ResourceType, number>();

        for (const [type, amount] of Object.entries(resources)) {
            if (amount !== undefined) {
                if (amount < 0) {
                    throw new InvalidResourceAmountError(amount);
                }
                if (amount > 0) {
                    resourceMap.set(type as ResourceType, amount);
                }
            }
        }

        return new ResourceBundle(resourceMap);
    }

    /**
     * Returns the amount of a specific resource.
     *
     * @param {ResourceType} type - The resource type.
     * @returns {number} The amount of the resource.
     */
    get(type: ResourceType): number {
        return this.resources.get(type) ?? 0;
    }

    /**
     * Adds resources to this bundle and returns a new ResourceBundle.
     *
     * @param {ResourceBundle} other - The resources to add.
     * @returns {ResourceBundle} A new ResourceBundle with the combined resources.
     */
    add(other: ResourceBundle): ResourceBundle {
        const newResources = new Map(this.resources);

        for (const [type, amount] of other.resources.entries()) {
            const currentAmount = newResources.get(type) ?? 0;
            newResources.set(type, currentAmount + amount);
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
        const newResources = new Map(this.resources);

        for (const [type, amount] of other.resources.entries()) {
            const currentAmount = newResources.get(type) ?? 0;
            if (currentAmount < amount) {
                throw new InsufficientResourcesError(type, amount, currentAmount);
            }
            const remaining = currentAmount - amount;
            if (remaining > 0) {
                newResources.set(type, remaining);
            } else {
                newResources.delete(type);
            }
        }

        return new ResourceBundle(newResources);
    }

    /**
     * Checks if this bundle has at least the specified resources.
     *
     * @param {ResourceBundle} other - The resources to check.
     * @returns {boolean} True if this bundle has sufficient resources.
     */
    has(other: ResourceBundle): boolean {
        for (const [type, amount] of other.resources.entries()) {
            const currentAmount = this.resources.get(type) ?? 0;
            if (currentAmount < amount) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the total count of all resources.
     *
     * @returns {number} The total resource count.
     */
    total(): number {
        let sum = 0;
        for (const amount of this.resources.values()) {
            sum += amount;
        }
        return sum;
    }

    /**
     * Compares this ResourceBundle with another for equality.
     *
     * @param {ResourceBundle} other - The other bundle to compare.
     * @returns {boolean} True if both bundles have identical resources.
     */
    equals(other: ResourceBundle): boolean {
        if (this.resources.size !== other.resources.size) {
            return false;
        }

        for (const [type, amount] of this.resources.entries()) {
            if (other.get(type) !== amount) {
                return false;
            }
        }

        return true;
    }
}
