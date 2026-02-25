import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { SyncPlayerCommand } from '#matchmaking/interface/ws/command/SyncPlayerCommand';
import { SyncPlayerCommandHandler } from '#matchmaking/interface/ws/handlers/SyncPlayerCommandHandler';
import { LobbySocket, SocketData } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { LobbyMapper } from '#matchmaking/interface/ws/mapper/LobbyMapper';
import { WsEvents } from '#matchmaking/interface/ws/WsEventsType';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { Server } from 'socket.io';
import { it, beforeEach, describe, vi, expect } from 'vitest';

const { lobby } = LobbyMother.baseLobby();
const player = lobby.allPlayers[0];

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

let syncPlayerCommandHandler: SyncPlayerCommandHandler;
let command: SyncPlayerCommand;
beforeEach(() => {
    syncPlayerCommandHandler = new SyncPlayerCommandHandler(mockUseCase);
    mockClient.data = {} as SocketData;
    vi.clearAllMocks();
    command = new SyncPlayerCommand({
        secretKey: player.id.value,
        lobbyId: lobby.id.value,
    });
});

describe('SyncPlayerCommandHandler', () => {
    describe('handle', () => {
        describe('when the user was not in a room', () => {
            it('adds the player to the room and emits the updated lobby', async () => {
                await syncPlayerCommandHandler.handle(command, mockServer, mockClient);

                expect(execute).toHaveBeenCalledWith({
                    lobbyId: new LobbyId(command.payload.lobbyId),
                });
                expect(leave).not.toHaveBeenCalled();
                expect(join).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
                expect(mockClient.data).toEqual({
                    lobbyId: lobby.id.value,
                    secretKey: player.id.value,
                });
                expect(toMock).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
                expect(emitMock).toHaveBeenCalledWith(
                    WsEvents.LOBBY_UPDATED,
                    LobbyMapper.toLobbyWsResponse(lobby)
                );
            });
        });

        describe('when the user was already in a room', () => {
            it('removes the user from the previous room', async () => {
                mockClient.data = { secretKey: player.id.value, lobbyId: lobby.id.value };

                await syncPlayerCommandHandler.handle(command, mockServer, mockClient);

                expect(leave).toHaveBeenCalledWith(`lobby-${mockClient.data.lobbyId}`);
            });

            it('adds the player to the room and emits the updated lobby', async () => {
                await syncPlayerCommandHandler.handle(command, mockServer, mockClient);

                expect(execute).toHaveBeenCalledWith({
                    lobbyId: new LobbyId(command.payload.lobbyId),
                });
                expect(leave).not.toHaveBeenCalled();
                expect(join).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
                expect(mockClient.data).toEqual({
                    lobbyId: lobby.id.value,
                    secretKey: player.id.value,
                });
                expect(toMock).toHaveBeenCalledWith(`lobby-${lobby.id.value}`);
                expect(emitMock).toHaveBeenCalledWith(
                    WsEvents.LOBBY_UPDATED,
                    LobbyMapper.toLobbyWsResponse(lobby)
                );
            });
        });
    });
});
