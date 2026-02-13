import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateLobbyRequest } from './request/CreateLobbyRequest';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';

@Controller('lobby')
export class LobbyController {
    constructor(
        private readonly createLobby: CreateLobbyUseCase,
        private readonly getLobby: GetLobbyUseCase
    ) {}

    @Post()
    create(@Body() createLobbyRequest: CreateLobbyRequest): string {
        const test: CreateLobbyDto = {
            hostName: createLobbyRequest.hostName,
            gameMode: createLobbyRequest.gameMode,
        };

        return this.createLobby.execute(test).createdLobby.id.value;
    }

    @Get(':id')
    getLobbyById(@Param('id') id: string): string {
        return this.getLobby.execute({ lobbyId: new LobbyId(id) }).id.value;
    }
}
