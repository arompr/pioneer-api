import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { SyncPlayerCommand } from '#matchmaking/interface/ws/command/SyncPlayerCommand';
import { SyncPlayerCommandHandler } from '#matchmaking/interface/ws/handlers/SyncPlayerCommandHandler';
import { LobbySocket, SocketData } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { LobbyMapper } from '#matchmaking/interface/ws/mapper/LobbyMapper';
import { WsEvents } from '#matchmaking/interface/ws/WsEventsType';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { Server } from 'socket.io';
import { it, beforeEach, describe, vi, expect } from 'vitest';
import { SocketAlreadyAuthenticatedError } from '#matchmaking/interface/ws/errors/SocketAlreadyAuthenticatedError';

const { lobby } = LobbyMother.baseLobby();
const player = lobby.allPlayers[0];
const TOKEN = 'mock-jwt-token';

const leave = vi.fn();
const join = vi.fn();
const mockClient = { data: {} as SocketData, join, leave } as unknown as LobbySocket;

const emitMock = vi.fn();
const toMock = vi.fn().mockReturnValue({ emit: emitMock });
const mockServer = {
    to: toMock,
} as unknown as Server;

const execute = vi.fn().mockReturnValue(lobby);
const mockUseCase: GetLobbyUseCase = {
    execute: execute,
} as unknown as GetLobbyUseCase;

const mockJwtTokenService = {
    decode: vi.fn().mockReturnValue({ playerId: player.id, lobbyId: lobby.id }),
};

let syncPlayerCommandHandler: SyncPlayerCommandHandler;
let command: SyncPlayerCommand;
beforeEach(() => {
    syncPlayerCommandHandler = new SyncPlayerCommandHandler(
        mockUseCase,
        mockJwtTokenService as unknown as JwtTokenService
    );
    mockClient.data = {} as SocketData;
    vi.clearAllMocks();
    execute.mockReturnValue(lobby);
    command = new SyncPlayerCommand({ token: TOKEN });
});

describe('SyncPlayerCommandHandler', () => {
    describe('handle', () => {
        describe('when the user was not sync', () => {
            it('decodes the token, joins the room, and emits the updated lobby', async () => {
                await syncPlayerCommandHandler.handle(command, mockServer, mockClient);

                expect(mockJwtTokenService.decode).toHaveBeenCalledWith(TOKEN);
                expect(execute).toHaveBeenCalledWith({ lobbyId: lobby.id });
                expect(leave).not.toHaveBeenCalled();
                expect(join).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
                expect(join).toHaveBeenCalledWith(`player-${player.id.value}`);
                expect(mockClient.data).toEqual({
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

        describe('when the user was already sync', () => {
            it('throw SocketAlreadyAuthenticatedError', async () => {
                mockClient.data = {
                    lobbyId: new LobbyId('old-lobby'),
                    playerId: new PlayerId('old-player'),
                };

                await expect(
                    syncPlayerCommandHandler.handle(command, mockServer, mockClient)
                ).rejects.toThrow(SocketAlreadyAuthenticatedError);
            });
        });
    });
});
