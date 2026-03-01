import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import type { WsCommand } from '#common/interface/ws/command/WsCommand';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { RequiresAuth } from '#matchmaking/interface/ws/decorator/RequiresAuth';
import { SocketNotAuthenticatedError } from '#matchmaking/interface/ws/errors/SocketNotAuthenticatedError';
import type { LobbySocket } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { Server } from 'socket.io';
import { beforeEach, describe, expect, it } from 'vitest';

class TestHandler {
    @RequiresAuth()
    handle(_command: WsCommand, _server: Server, _client: LobbySocket) {
        return 'ok';
    }
}

let mockServer: Server;
let command: WsCommand;

describe('@RequiresAuth decorator', () => {
    beforeEach(() => {
        command = { type: 'TEST' } as WsCommand;
        mockServer = {} as Server;
    });

    describe('when the socket is not authenticated', () => {
        it('throws SocketNotAuthenticatedError', () => {
            const handler = new TestHandler();
            const client: LobbySocket = {
                data: {},
            } as unknown as LobbySocket;

            expect(() => handler.handle(command, mockServer, client)).toThrow(
                SocketNotAuthenticatedError
            );
        });
    });

    describe('when the socket is authenticated', () => {
        it('calls the original method if', () => {
            const handler = new TestHandler();
            const client: LobbySocket = {
                data: { lobbyId: new LobbyId('123'), playerId: new PlayerId('abc') },
            } as unknown as LobbySocket;

            const result = handler.handle(command, mockServer, client);

            expect(result).toBe('ok');
        });
    });
});
