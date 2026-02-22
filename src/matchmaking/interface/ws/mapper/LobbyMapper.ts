import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyWsResponse } from '../response/LobbyWsResponse';

export class LobbyMapper {
    static toLobbyWsResponse(lobby: LobbyAggregate): LobbyWsResponse {
        return {
            id: lobby.id.value,
            status: lobby.stateType,
            players: lobby.allPlayers.map((player) => ({
                publicKey: player.publicKey.value,
                name: player.name,
                status: player.status,
                isHost: lobby.isHost(player.id),
            })),
            config: {
                gameMode: lobby.config.getGameMode(),
                maxPlayers: lobby.config.maxPlayers,
                minPlayers: lobby.config.minPlayers,
            },
        };
    }
}
