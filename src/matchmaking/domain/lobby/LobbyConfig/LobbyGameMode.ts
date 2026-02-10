import { InvalidLobbyGameModeError } from '../errors/InvalidLobbyGameModeError';

export enum LobbyGameMode {
    BASE = 'BASE',
}

export function lobbyGameModeFromString(value: string): LobbyGameMode {
    if (Object.values(LobbyGameMode).includes(value as LobbyGameMode)) {
        return value as LobbyGameMode;
    }
    throw new InvalidLobbyGameModeError(value);
}
