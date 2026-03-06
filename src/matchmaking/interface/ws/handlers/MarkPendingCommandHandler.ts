import type { Server } from 'socket.io';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import type { LobbySocket } from '../LobbyGatewayWs';
import { RequiresAuth } from '../decorator/RequiresAuth';
import { MarkPendingCommand } from '../command/MarkPendingCommand';
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';

export class MarkPendingCommandHandler implements WsCommandHandler<MarkPendingCommand> {
    constructor(private readonly useCase: MarkPendingUseCase) {}

    @RequiresAuth()
    handle(_command: MarkPendingCommand, server: Server, client: LobbySocket): void {
        const lobbyId = client.data.lobbyId;
        const playerId = client.data.playerId;

        const lobby = this.useCase.execute({ lobbyId, playerId });

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
