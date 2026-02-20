import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyPlayers } from '#matchmaking/domain/lobby/LobbyPlayers';
import { LobbyStateRegistry } from '#matchmaking/domain/lobby/states/LobbyStateRegistry';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { InMemoryPlayerMapper } from '../player/InMemoryPlayerMapper';
import { InMemoryLobby } from './InMemoryLobby';
import { InMemoryLobbyConfigMapper } from './lobbyConfig/InMemoryLobbyConfigMapper';

export class InMemoryLobbyMapper {
    static toInMemory(lobby: LobbyAggregate): InMemoryLobby {
        return new InMemoryLobby(
            lobby.id.value,
            InMemoryLobbyConfigMapper.toInMemory(lobby.config),
            lobby.hostId.value,
            lobby.allPlayers.map((p) => InMemoryPlayerMapper.toInMemory(p)),
            lobby.stateType
        );
    }

    static toDomain(imLobby: InMemoryLobby): Lobby {
        const config = InMemoryLobbyConfigMapper.toDomain(imLobby.config);
        const players = new LobbyPlayers(
            imLobby.players.map((p) => InMemoryPlayerMapper.toDomain(p))
        );
        const state = LobbyStateRegistry.fromString(imLobby.state);

        return new Lobby(
            new LobbyId(imLobby.id),
            config,
            new PlayerId(imLobby.hostId),
            players,
            state
        );
    }
}
