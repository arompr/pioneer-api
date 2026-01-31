import { DomainError } from '@/common/domain/DomainError.ts';

export class PlayerNotFoundError extends DomainError {
    constructor() {
        super(`Player was not found in the lobby`);
    }
}
