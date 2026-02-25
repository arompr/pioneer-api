import { Server } from 'socket.io';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { WsEvents } from '../WsEventsType';
import { LobbyMapper } from '../mapper/LobbyMapper';
import { SyncPlayerCommand } from '../command/SyncPlayerCommand';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbySocket } from '../LobbyGatewayWs';

export class SyncPlayerCommandHandler implements WsCommandHandler<SyncPlayerCommand> {
    constructor(private readonly useCase: GetLobbyUseCase) {}

    async handle(command: SyncPlayerCommand, server: Server, client: LobbySocket): Promise<void> {
        const lobby = this.useCase.execute({ lobbyId: new LobbyId(command.payload.lobbyId) });
        const player = lobby.findPlayer(new PlayerId(command.payload.secretKey));

        if (client.data.lobbyId) {
            await client.leave(`lobby-${client.data.lobbyId}`);
        }

        await client.join(`lobby-${lobby.id.value}`);

        client.data.lobbyId = lobby.id.value;
        client.data.secretKey = player.id.value;

        server
            .to(`lobby-${lobby.id.value}`)
            .emit(WsEvents.LOBBY_UPDATED, LobbyMapper.toLobbyWsResponse(lobby));
    }
}
