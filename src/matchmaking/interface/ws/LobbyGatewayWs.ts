import {
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { WsCommand } from './command/WsCommand';
import { WsCommandDispatcher } from './command/WsCommandDispatcher';

export interface SocketData {
    lobbyId?: string;
    secretKey?: string;
}

export type LobbySocket = Socket<any, any, any, SocketData>;

@WebSocketGateway({ cors: { origin: '*' } })
export class LobbyGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server!: Server;

    constructor(private readonly dispatcher: WsCommandDispatcher) {}

    handleDisconnect(client: LobbySocket): void {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('command')
    async onCommand(client: LobbySocket, command: WsCommand): Promise<void> {
        console.log(this.dispatcher);
        await this.dispatcher.dispatch(command, client, this.server);
    }
}
