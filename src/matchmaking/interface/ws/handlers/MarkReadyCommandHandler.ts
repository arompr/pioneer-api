import { Server } from 'socket.io';
import { MarkReadyCommand } from '../command/MarkReadyCommand';
import { WsCommandHandler } from '../command/WsCommandHandler';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import { LobbySocket } from '../LobbyGatewayWs';

export class MarkReadyCommandHandler implements WsCommandHandler<MarkReadyCommand> {
    constructor(private readonly useCase: MarkReadyUseCase) {}

    handle(command: MarkReadyCommand, server: Server, _client: LobbySocket): void {
        const lobbyId = new LobbyId(command.payload.lobbyId);
        const playerId = new PlayerId(command.payload.playerId);

        const lobby = this.useCase.execute({ lobbyId, playerId });

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
