import { Server } from 'socket.io';
import { MarkReadyCommand } from '../command/MarkReadyCommand';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import { LobbySocket } from '../LobbyGatewayWs';

export class MarkReadyCommandHandler implements WsCommandHandler<MarkReadyCommand> {
    constructor(private readonly useCase: MarkReadyUseCase) {}

    handle(_command: MarkReadyCommand, server: Server, client: LobbySocket): void {
        const lobbyId = new LobbyId(client.data.lobbyId);
        const playerId = new PlayerId(client.data.secretKey);

        const lobby = this.useCase.execute({ lobbyId, playerId });

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
