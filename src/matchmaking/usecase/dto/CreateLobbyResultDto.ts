import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class CreateLobbyResultDto {
    constructor(
        public readonly lobbyId: LobbyId,
        public readonly playerId: PlayerId
    ) {}
}
