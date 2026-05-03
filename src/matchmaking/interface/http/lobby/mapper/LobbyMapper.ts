import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyResponse } from '../response/lobby/LobbyResponse';

export class LobbyMapper {
    static toLobbyResponse(lobby: LobbyAggregate): LobbyResponse {
        return {
            id: lobby.id.value,
            status: lobby.stateType,
            players: lobby.allPlayers.map((player) => ({
                id: player.id.value,
                name: player.name,
                status: player.status,
                isHost: lobby.isHost(player.id),
            })),
            config: {
                gameConfigId: lobby.config.getGameConfigId().value,
                maxPlayers: lobby.config.maxPlayers,
                minPlayers: lobby.config.minPlayers,
            },
        };
    }
}
