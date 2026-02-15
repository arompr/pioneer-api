import { DomainError } from '#common/domain/DomainError';
import { ResourceType } from '#game/domain/shared/ResourceType';

/**
 * Error thrown when a player attempts to deduct more resources than they have.
 */
export class InsufficientResourcesError extends DomainError {
    public readonly resourceType: ResourceType;
    public readonly required: number;
    public readonly available: number;

    constructor(resourceType: ResourceType, required: number, available: number) {
        super(`Insufficient ${resourceType}: required ${required}, available ${available}`);
        this.resourceType = resourceType;
        this.required = required;
        this.available = available;
    }
}
