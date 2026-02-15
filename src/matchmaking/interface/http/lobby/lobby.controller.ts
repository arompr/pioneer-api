import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateLobbyRequest } from './request/CreateLobbyRequest';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyMapper } from './mapper/LobbyMapper';
import { UseErrorFilters } from './filters/UseErrorFilters';
import type { LobbyResponse } from './response/lobby/LobbyResponse';
import type { CreateLobbyResponse } from './response/lobby/CreateLobbyResponse';
import { PrivatePlayerMapper } from './mapper/PrivatePlayerMapper';
import { JoinLobbyRequest } from './request/JoinLobbyRequest';
import type { JoinLobbyResponse } from './response/lobby/JoinLobbyResponse';
import { JoinLobbyDto } from '#matchmaking/usecase/dto/JoinLobbyDto';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyRequest } from './request/LeaveLobbyRequest';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';

@UseErrorFilters()
@Controller('lobby')
export class LobbyController {
    constructor(
        private readonly createLobby: CreateLobbyUseCase,
        private readonly getLobby: GetLobbyUseCase,
        private readonly joinLobby: JoinLobbyUseCase,
        private readonly leaveLobby: LeaveLobbyUseCase
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
            lobby: LobbyMapper.toLobbyResponse(createdLobby),
            selfPlayer: PrivatePlayerMapper.toPlayerResponse(createdHostPlayer, true),
        };
    }

    /**
     * Allows a new player to join an existing lobby.
     *
     * The player is identified using the secret key provided in the request body.
     * Once the player is removed, the endpoint returns HTTP 204 No Content since
     * the player leaving no longer requires any lobby information.
     *
     * @param {string} id - The lobby ID.
     * @param {JoinLobbyRequest} joinRequest - Contains the player's name.
     * @returns {JoinLobbyResponse} The updated lobby and the joining player's private view.
     *
     * @example
     * POST /lobby/:id/join
     * {
     *   "playerName": "Alice"
     * }
     */
    @Post(':id/join')
    join(@Param('id') id: string, @Body() joinRequest: JoinLobbyRequest): JoinLobbyResponse {
        const dto: JoinLobbyDto = { lobbyId: new LobbyId(id), playerName: joinRequest.playerName };

        const { lobby, joinedPlayer } = this.joinLobby.execute(dto);

        return {
            lobby: LobbyMapper.toLobbyResponse(lobby),
            selfPlayer: PrivatePlayerMapper.toPlayerResponse(
                joinedPlayer,
                lobby.isHost(joinedPlayer.id)
            ),
        };
    }

    /**
     * Removes a player from a lobby.
     *
     * The player is identified using the secret key provided in the request body.
     * Once the player is removed, the endpoint returns HTTP 204 No Content since
     * the player leaving no longer requires any lobby information.
     *
     * @param {string} id - The lobby ID provided in the URL path.
     * @param {LeaveLobbyRequest} leaveRequest - Contains the secret key identifying the player.
     *
     * * @example
     * POST /lobby/3f8c9c2e-1b4d-4f2e-9c3a-8d2f1a7b9c11/leave
     * {
     *   "secretKey": "player-secret-key-123"
     * }
     */
    @Post(':id/leave')
    @HttpCode(HttpStatus.NO_CONTENT)
    leave(@Param('id') id: string, @Body() leaveRequest: LeaveLobbyRequest): void {
        this.leaveLobby.execute({
            lobbyId: new LobbyId(id),
            playerId: new PlayerId(leaveRequest.secretKey),
        });
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
        return LobbyMapper.toLobbyResponse(this.getLobby.execute({ lobbyId: new LobbyId(id) }));
    }
}
