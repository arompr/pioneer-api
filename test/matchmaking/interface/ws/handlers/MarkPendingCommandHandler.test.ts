import { MarkPendingCommand } from '#matchmaking/interface/ws/command/MarkPendingCommand';
import { MarkPendingCommandHandler } from '#matchmaking/interface/ws/handlers/MarkPendingCommandHandler';
import { LobbySocket, SocketData } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { LobbyMapper } from '#matchmaking/interface/ws/mapper/LobbyMapper';
import { WsEvents } from '#matchmaking/interface/ws/WsEventsType';
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';
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

const execute = vi.fn().mockReturnValue(lobby);
const mockUseCase: MarkPendingUseCase = {
    execute,
} as unknown as MarkPendingUseCase;

let markPendingCommandHandler: MarkPendingCommandHandler;
beforeEach(() => {
    markPendingCommandHandler = new MarkPendingCommandHandler(mockUseCase);
    vi.clearAllMocks();
});

describe('MarkPendingCommandHandler', () => {
    describe('handle', () => {
        it('marks the player pending and emits the updated lobby', () => {
            const command = new MarkPendingCommand();

            markPendingCommandHandler.handle(command, mockServer, mockClient);

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
