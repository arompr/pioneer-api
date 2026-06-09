import { InvalidGameModeError } from './errors/InvalidGameModeError';

export enum GameMode {
    BASE = 'BASE',
}

export function gameModeFromString(value: string): GameMode {
    if (Object.values(GameMode).includes(value as GameMode)) {
        return value as GameMode;
    }
    throw new InvalidGameModeError(value);
}
