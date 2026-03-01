import { Server } from 'socket.io';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import { SyncPlayerCommand } from '../command/SyncPlayerCommand';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { LobbySocket } from '../LobbyGatewayWs';
import { SocketAlreadyAuthenticatedError } from '../errors/SocketAlreadyAuthenticatedError';
import { UnauthorizedException } from '@nestjs/common';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';

export class SyncPlayerCommandHandler implements WsCommandHandler<SyncPlayerCommand> {
    constructor(
        private readonly useCase: GetLobbyUseCase,
        private readonly jwtTokenService: JwtTokenService
    ) {}

    async handle(command: SyncPlayerCommand, server: Server, client: LobbySocket): Promise<void> {
        if (client.data.lobbyId || client.data.playerId) {
            throw new SocketAlreadyAuthenticatedError();
        }

        let playerId: PlayerId;
        let lobbyId: LobbyId;

        try {
            ({ playerId, lobbyId } = this.jwtTokenService.decode(command.payload.token));
        } catch {
            throw new UnauthorizedException();
        }

        const lobby = this.useCase.execute({ lobbyId });
        const player = lobby.findPlayer(playerId);

        await client.join(`lobby-${lobby.id.value}`);
        await client.join(`player-${player.id.value}`);

        client.data.lobbyId = lobbyId;
        client.data.playerId = playerId;

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
