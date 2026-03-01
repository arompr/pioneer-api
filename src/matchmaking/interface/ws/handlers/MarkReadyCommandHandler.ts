import { Server } from 'socket.io';
import { MarkReadyCommand } from '../command/MarkReadyCommand';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import type { LobbySocket } from '../LobbyGatewayWs';
import { RequiresAuth } from '../decorator/RequiresAuth';

export class MarkReadyCommandHandler implements WsCommandHandler<MarkReadyCommand> {
    constructor(private readonly useCase: MarkReadyUseCase) {}

    @RequiresAuth()
    handle(_command: MarkReadyCommand, server: Server, client: LobbySocket): void {
        const lobbyId = client.data.lobbyId;
        const playerId = client.data.playerId;

        const lobby = this.useCase.execute({ lobbyId, playerId });

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
