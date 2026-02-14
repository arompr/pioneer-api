import { ResourceType } from '../shared/ResourceType';
import { InsufficientResourcesError } from './errors/InsufficientResourcesError';
import { InvalidResourceAmountError } from './errors/InvalidResourceAmountError';

/**
 * Value Object representing a bundle of resources.
 *
 * Supports add, deduct, and has operations for managing player resources.
 */
export class ResourceHand {
    private readonly _resources: Map<ResourceType, number>;

    private constructor(resources: Map<ResourceType, number>) {
        this._resources = resources;
    }

    /**
     * Creates an empty ResourceBundle.
     */
    static empty(): ResourceHand {
        return new ResourceHand(new Map());
    }

    /**
     * Creates a ResourceHand with the specified resources.
     *
     * @param {Partial<Record<ResourceType, number>>} resources - Initial resources.
     * @throws {InvalidResourceAmountError} If any amount is negative.
     */
    static of(resources: Partial<Record<ResourceType, number>>): ResourceHand {
        const entries = Object.entries(resources);
        this.requireValidResourceAmounts(entries);

        const resourceMap = new Map<ResourceType, number>(
            entries.map(([type, amount]) => [type as ResourceType, amount])
        );

        return new ResourceHand(resourceMap);
    }

    private static requireValidResourceAmounts(entries: [string, number][]) {
        entries.forEach(([_, amount]) => {
            if (amount !== undefined && amount < 0) {
                throw new InvalidResourceAmountError(amount);
            }
        });
    }

    /**
     * Adds resources to this bundle and returns a new ResourceBundle.
     *
     * @param {ResourceHand} other - The resources to add.
     * @returns {ResourceHand} A new ResourceBundle with the combined resources.
     */
    add(other: ResourceHand): ResourceHand {
        const newResources = new Map(this._resources);

        for (const [type, amount] of other._resources.entries()) {
            const currentAmount = this.getAmount(type);
            newResources.set(type, currentAmount + amount);
        }

        return new ResourceHand(newResources);
    }

    /**
     * Deducts resources from this bundle and returns a new ResourceBundle.
     *
     * @param {ResourceHand} other - The resources to deduct.
     * @returns {ResourceHand} A new ResourceBundle with the resources deducted.
     * @throws {InsufficientResourcesError} If any resource is insufficient.
     */
    deduct(other: ResourceHand): ResourceHand {
        this.requireSufficientResources(this, other);

        const newResources = new Map(this._resources);
        for (const [type, amount] of other._resources.entries()) {
            const currentAmount = newResources.get(type) ?? 0;
            const remaining = currentAmount - amount;
            newResources.set(type, remaining);
        }

        return new ResourceHand(newResources);
    }

    private requireSufficientResources(available: ResourceHand, required: ResourceHand): void {
        for (const [type, requierdAmount] of required._resources.entries()) {
            const currentAmount = available.getAmount(type);
            if (currentAmount < requierdAmount) {
                throw new InsufficientResourcesError(type, requierdAmount, currentAmount);
            }
        }
    }

    /**
     * Checks if this bundle has at least the specified resources.
     *
     * @param {ResourceHand} other - The resources to check.
     * @returns {boolean} True if this bundle has sufficient resources.
     */
    has(other: ResourceHand): boolean {
        return Array.from(other._resources.entries()).every(
            ([type, amount]) => this.getAmount(type) >= amount
        );
    }

    /**
     * Returns the total count of all resources.
     *
     * @returns {number} The total resource count.
     */
    total(): number {
        return Array.from(this._resources.values()).reduce((sum, amount) => sum + amount, 0);
    }

    /**
     * Returns the amount of a specific resource.
     *
     * @param {ResourceType} type - The resource type.
     * @returns {number} The amount of the resource.
     */
    public getAmount(type: ResourceType): number {
        return this._resources.get(type) ?? 0;
    }

    /**
     * Compares this ResourceBundle with another for equality.
     *
     * @param {ResourceHand} other - The other bundle to compare.
     * @returns {boolean} True if both bundles have identical resources.
     */
    equals(other: ResourceHand): boolean {
        if (this._resources.size !== other._resources.size) {
            return false;
        }

        return Array.from(other._resources.entries()).every(
            ([type, amount]) => this.getAmount(type) === amount
        );
    }
}
