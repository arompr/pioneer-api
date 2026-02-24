import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Server } from 'socket.io';
import { WsCommandDispatcher } from '#common/interface/ws/command/WsCommandDispatcher';
import { UnknownCommandError } from '#matchmaking/interface/ws/errors/UnknownCommandError';
import { LobbySocket } from '#matchmaking/interface/ws/LobbyGatewayWs';

let commandDispatcher: WsCommandDispatcher;
const mockServer = {} as unknown as Server;
const mockClient = {} as unknown as LobbySocket;

const commandeHandler1 = {
    handle: vi.fn(),
};

describe('WsCommandDispatcher', () => {
    beforeEach(() => {
        commandDispatcher = new WsCommandDispatcher();
    });

    describe('dispatch', () => {
        describe('when the command is not registered', () => {
            it('throws an error', async () => {
                const command = { type: 'UNKNOWN_COMMAND', payload: {} };

                await expect(
                    commandDispatcher.dispatch(command, mockClient, mockServer)
                ).rejects.toThrow(UnknownCommandError);
            });
        });

        describe('when the command is registered', () => {
            beforeEach(() => {
                commandDispatcher.register('TEST_COMMAND', commandeHandler1);
            });

            it('calls the handler with the command and client', async () => {
                const command = { type: 'TEST_COMMAND', payload: { test: 'value' } };

                await commandDispatcher.dispatch(command, mockClient, mockServer);

                expect(commandeHandler1.handle).toHaveBeenCalledWith(
                    command,
                    mockClient,
                    mockServer
                );
            });
        });
    });
});
