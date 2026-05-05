import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyPlayers } from '#matchmaking/domain/lobby/LobbyPlayers';
import { LobbyStateRegistry } from '#matchmaking/domain/lobby/states/LobbyStateRegistry';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { InMemoryPlayerMapper } from '../player/InMemoryPlayerMapper';
import { InMemoryLobby } from './InMemoryLobby';

export class InMemoryLobbyMapper {
    static toInMemory(lobby: LobbyAggregate): InMemoryLobby {
        return new InMemoryLobby(
            lobby.id.value,
            lobby.hostId.value,
            lobby.allPlayers.map((p) => InMemoryPlayerMapper.toInMemory(p)),
            lobby.stateType,
            lobby.gameConfigId ? lobby.gameConfigId.value : undefined
        );
    }

    static toDomain(imLobby: InMemoryLobby): Lobby {
        const players = new LobbyPlayers(
            imLobby.players.map((p) => InMemoryPlayerMapper.toDomain(p))
        );
        const state = LobbyStateRegistry.fromString(imLobby.state);
        const gameConfigId = imLobby.gameConfigId
            ? new GameConfigId(imLobby.gameConfigId)
            : undefined;

        return new Lobby(
            new LobbyId(imLobby.id),
            new PlayerId(imLobby.hostId),
            players,
            state,
            gameConfigId
        );
    }
}
