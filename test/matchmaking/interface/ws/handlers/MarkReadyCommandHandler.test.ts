import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
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
    data: { lobbyId: lobby.id.value, secretKey: player.id.value } as SocketData,
} as unknown as LobbySocket;

const emitMock = vi.fn();
const toMock = vi.fn().mockReturnValue({ emit: emitMock });
const mockServer = {
    to: toMock,
} as unknown as Server;

const execute = vi.fn().mockReturnValue(lobby);
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
        it('marks the player ready and emits the updated lobby', () => {
            const command = new MarkReadyCommand();

            markReadyCommandHandler.handle(command, mockServer, mockClient);

            expect(execute).toBeCalledWith({
                lobbyId: new LobbyId(mockClient.data.lobbyId),
                playerId: new PlayerId(mockClient.data.secretKey),
            });
            expect(toMock).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
            expect(emitMock).toHaveBeenCalledWith(
                WsEvents.LOBBY_UPDATED,
                LobbyMapper.toLobbyWsResponse(lobby)
            );
        });
    });
});
