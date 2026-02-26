import { Server } from 'socket.io';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import { SyncPlayerCommand } from '../command/SyncPlayerCommand';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { LobbySocket } from '../LobbyGatewayWs';

export class SyncPlayerCommandHandler implements WsCommandHandler<SyncPlayerCommand> {
    constructor(
        private readonly useCase: GetLobbyUseCase,
        private readonly jwtTokenService: JwtTokenService
    ) {}

    async handle(command: SyncPlayerCommand, server: Server, client: LobbySocket): Promise<void> {
        const { playerId, lobbyId } = this.jwtTokenService.decode(command.payload.token);

        const lobby = this.useCase.execute({ lobbyId });

        if (client.data.lobbyId) {
            await client.leave(`lobby-${client.data.lobbyId.value}`);
        }

        await client.join(`lobby-${lobby.id.value}`);

        client.data.lobbyId = lobbyId;
        client.data.playerId = playerId;

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
