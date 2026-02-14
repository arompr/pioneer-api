import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyResponse } from '../response/lobby/LobbyResponse';

export class LobbyMapper {
    static toApi(lobby: LobbyAggregate): LobbyResponse {
        return {
            id: lobby.id.value,
            status: lobby.stateType,
            players: lobby.allPlayers.map((player) => ({
                publicKey: player.publicKey.toString(),
                name: player.name,
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
