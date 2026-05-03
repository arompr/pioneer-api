import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { InMemoryLobbyConfig } from './InMemoryLobbyConfig';

export class InMemoryLobbyConfigMapper {
    static toInMemory(config: LobbyConfig): InMemoryLobbyConfig {
        return new InMemoryLobbyConfig(
            config.getGameConfigId().value,
            config.minPlayers,
            config.maxPlayers
        );
    }

    static toDomain(imLobbyConfig: InMemoryLobbyConfig): LobbyConfig {
        return new LobbyConfig(
            new GameConfigId(imLobbyConfig.gameConfigId),
            imLobbyConfig.minPlayers,
            imLobbyConfig.maxPlayers
        );
    }
}
