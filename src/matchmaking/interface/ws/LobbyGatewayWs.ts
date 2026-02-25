import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsCommandDispatcher } from '#matchmaking/interface/ws/command/WsCommandDispatcher';
import { UseErrorFilters } from './filters/UseErrorFilters';

export interface SocketData {
    lobbyId: string;
    secretKey: string;
}

export type LobbySocket = Socket<any, any, any, SocketData>;

@UseErrorFilters()
@WebSocketGateway({ cors: { origin: '*' } })
export class LobbyGateway implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    private readonly server!: Server;

    constructor(private readonly dispatcher: WsCommandDispatcher) {}
    handleConnection(client: LobbySocket): void {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: LobbySocket): void {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('command')
    async onCommand(client: LobbySocket, command: WsCommand): Promise<void> {
        await this.dispatcher.dispatch(command, client, this.server);
    }
}
