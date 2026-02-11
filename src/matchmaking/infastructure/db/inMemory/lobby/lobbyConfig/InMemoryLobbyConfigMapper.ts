import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { lobbyGameModeFromString } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';
import { InMemoryLobbyConfig } from './InMemoryLobbyConfig';

export class InMemoryLobbyConfigMapper {
    static toInMemory(config: LobbyConfig): InMemoryLobbyConfig {
        return new InMemoryLobbyConfig(
            config.mode.toString(),
            config.minPlayers,
            config.maxPlayers
        );
    }

    static toDomain(imLobbyConfig: InMemoryLobbyConfig): LobbyConfig {
        return new LobbyConfig(
            lobbyGameModeFromString(imLobbyConfig.mode),
            imLobbyConfig.minPlayers,
            imLobbyConfig.maxPlayers
        );
    }
}
