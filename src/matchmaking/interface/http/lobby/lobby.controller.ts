import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateLobbyRequest } from './request/CreateLobbyRequest';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyMapper } from './mapper/LobbyMapper';
import { LobbyResponse } from './response/lobby/LobbyResponse';
import { CreateLobbyResponse } from './response/lobby/CreateLobbyResponse';
import { PrivatePlayerMapper } from './mapper/PrivatePlayerMapper';

@Controller('lobby')
export class LobbyController {
    constructor(
        private readonly createLobby: CreateLobbyUseCase,
        private readonly getLobby: GetLobbyUseCase
    ) {}

    /**
     * Creates a new lobby and returns both:
     * - the public lobby view (visible to all players)
     * - the private view of the player who created the lobby (selfPlayer)
     *
     * @param {CreateLobbyRequest} createLobbyRequest - The request body containing host name and game mode.
     * @returns {CreateLobbyResponse} The created lobby and the private representation of the host player.
     *
     * @example
     * POST /lobby
     * {
     *   "hostName": "Panadis",
     *   "gameMode": "BASE"
     * }
     */
    @Post()
    create(@Body() createLobbyRequest: CreateLobbyRequest): CreateLobbyResponse {
        const createdLobbyDto: CreateLobbyDto = {
            hostName: createLobbyRequest.hostName,
            gameMode: createLobbyRequest.gameMode,
        };

        const { createdLobby, createdHostPlayer } = this.createLobby.execute(createdLobbyDto);

        return {
            lobby: LobbyMapper.toApi(createdLobby),
            selfPlayer: PrivatePlayerMapper.toApi(createdHostPlayer, true),
        };
    }

    /**
     * Retrieves a lobby by its unique identifier.
     *
     * @param {string} id - The lobby ID provided in the URL path.
     * @returns {LobbyResponse} The public representation of the lobby.
     *
     * @example
     * GET /lobby/:lobby-id
     */
    @Get(':id')
    getLobbyById(@Param('id') id: string): LobbyResponse {
        return LobbyMapper.toApi(this.getLobby.execute({ lobbyId: new LobbyId(id) }));
    }
}
