import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { gameModeFromString } from '#game/domain/config/GameMode';
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
            gameModeFromString(imLobbyConfig.mode),
            imLobbyConfig.minPlayers,
            imLobbyConfig.maxPlayers
        );
    }
}
