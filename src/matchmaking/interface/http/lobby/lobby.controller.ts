import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    HttpCode,
    HttpStatus,
    Request,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';
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
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { LeaveLobbyDto } from '#matchmaking/usecase/dto/LeaveLobbyDto';
import type { AuthenticatedRequest } from '../auth/AuthenticatedRequest';
import { AuthGuard } from '../auth/auth.guard';

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
     * @param {CreateLobbyRequest} createLobbyRequest - The request body containing host name and optional game config ID.
     * @returns {CreateLobbyResponse} The created lobby and the private representation of the host player.
     *
     * @example
     * POST /lobby
     * {
     *   "hostName": "Panadis",
     *   "gameConfigId": "cfg-123" (optional)
     * }
     */
    @Post()
    async create(@Body() createLobbyRequest: CreateLobbyRequest): Promise<CreateLobbyResponse> {
        const createdLobbyDto: CreateLobbyDto = {
            hostName: createLobbyRequest.hostName,
        };

        console.warn('controller');
        const { createdLobby, createdHostPlayer, token } =
            await this.createLobby.execute(createdLobbyDto);

        return {
            lobby: LobbyMapper.toLobbyResponse(createdLobby),
            selfPlayer: PrivatePlayerMapper.toPlayerResponse(createdHostPlayer, true, token),
        };
    }

    /**
     * Allows a new player to join an existing lobby.
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
    async join(
        @Param('id') id: string,
        @Body() joinRequest: JoinLobbyRequest
    ): Promise<JoinLobbyResponse> {
        const dto: JoinLobbyDto = { lobbyId: new LobbyId(id), playerName: joinRequest.playerName };

        const { lobby, joinedPlayer, token } = await this.joinLobby.execute(dto);

        return {
            lobby: LobbyMapper.toLobbyResponse(lobby),
            selfPlayer: PrivatePlayerMapper.toPlayerResponse(
                joinedPlayer,
                lobby.isHost(joinedPlayer.id),
                token
            ),
        };
    }

    /**
     * Removes a player from a lobby.
     *
     * The player is identified via the JWT in the Authorization header.
     * Once the player is removed, the endpoint returns HTTP 204 No Content.
     *
     * @param {string} id - The lobby ID provided in the URL path.
     * @param {string} authorization - The Authorization header containing the Bearer JWT.
     *
     * @example
     * POST /lobby/3f8c9c2e-1b4d-4f2e-9c3a-8d2f1a7b9c11/leave
     * Authorization: Bearer <token>
     */
    @UseGuards(AuthGuard)
    @Post(':id/leave')
    @HttpCode(HttpStatus.NO_CONTENT)
    leave(@Param('id') id: string, @Request() req: AuthenticatedRequest): void {
        const { playerId, lobbyId } = req;
        const paramLobbyId = new LobbyId(id);

        if (!lobbyId.equals(paramLobbyId)) {
            throw new ForbiddenException('Token lobby does not match URL lobby');
        }

        this.leaveLobby.execute(new LeaveLobbyDto(lobbyId, playerId));
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
