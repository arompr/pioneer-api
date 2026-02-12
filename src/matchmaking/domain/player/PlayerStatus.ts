import { InvalidPlayerStatusError } from './errors/InvalidPlayerStatusError';

export enum PlayerStatus {
    Pending = 'PENDING',
    Ready = 'READY',
}

export function playerStatusFromString(value: string): PlayerStatus {
    if (Object.values(PlayerStatus).includes(value as PlayerStatus)) {
        return value as PlayerStatus;
    }
    throw new InvalidPlayerStatusError(value);
}
