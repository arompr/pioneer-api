import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server!: Server;

    handleConnection(client: Socket): void {
        const lol = client.handshake.auth.secret;
        console.log(`Client connected: ${client.id}`);
        client.emit('connected', { clientId: client.id });
    }

    handleDisconnect(client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('command')
    onCommand(client: Socket): void {
        client.emit('connected', { clientId: 'gg' });

        console.log('Commande');
    }
}
