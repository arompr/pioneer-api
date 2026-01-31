import { DomainError } from '@/common/domain/DomainError.ts';
import type { Player } from '../../player/Player.ts';

export class PlayerAlreadyInLobbyError extends DomainError {
    constructor() {
        super(`Player is already in the lobby`);
    }
}
