import { MarkReadyCommand } from '#matchmaking/interface/ws/command/MarkReadyCommand';
import { MarkReadyCommandHandler } from '#matchmaking/interface/ws/handlers/MarkReadyCommandHandler';
import { LobbySocket, SocketData } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { LobbyMapper } from '#matchmaking/interface/ws/mapper/LobbyMapper';
import { WsEvents } from '#matchmaking/interface/ws/WsEventsType';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { Server } from 'socket.io';
import { it, beforeEach, describe, vi, expect } from 'vitest';

const { lobby } = LobbyMother.baseLobby();
const player = lobby.allPlayers[0];

const mockClient = {
    data: { lobbyId: lobby.id, playerId: player.id } as SocketData,
} as unknown as LobbySocket;

const emitMock = vi.fn();
const toMock = vi.fn().mockReturnValue({ emit: emitMock });
const mockServer = {
    to: toMock,
} as unknown as Server;

const execute = vi.fn().mockResolvedValue(lobby);
const mockUseCase: MarkReadyUseCase = {
    execute,
} as unknown as MarkReadyUseCase;

let markReadyCommandHandler: MarkReadyCommandHandler;
beforeEach(() => {
    markReadyCommandHandler = new MarkReadyCommandHandler(mockUseCase);
    vi.clearAllMocks();
});

describe('MarkReadyCommandHandler', () => {
    describe('handle', () => {
        it('marks the player ready and emits the updated lobby', async () => {
            const command = new MarkReadyCommand();

            await markReadyCommandHandler.handle(command, mockServer, mockClient);

            expect(execute).toBeCalledWith({
                lobbyId: lobby.id,
                playerId: player.id,
            });
            expect(toMock).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
            expect(emitMock).toHaveBeenCalledWith(
                WsEvents.LOBBY_UPDATED,
                LobbyMapper.toLobbyWsResponse(lobby)
            );
        });
    });
});
