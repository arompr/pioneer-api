import { Controller, Post, Get, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateGameConfigRequest } from './request/CreateDefaultGameConfigRequest';
import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigMapper } from './mapper/GameConfigMapper';
import type { GameConfigResponse } from './response/GameConfigResponse';
import { UseGameConfigExceptionFilters } from './filters/UseGameConfigExceptionFilters';

@UseGameConfigExceptionFilters()
@Controller('gameconfigs')
export class GameConfigController {
    constructor(
        private readonly createGameConfig: CreateGameConfigUseCase,
        private readonly getGameConfig: GetGameConfigUseCase
    ) {}

    /**
     * Creates a new default game configuration for the specified game mode.
     *
     * @param {CreateGameConfigRequest} request - The request body containing the game mode.
     * @returns {GameConfigResponse} The created game configuration.
     *
     * @example
     * POST /gameconfigs
     * {
     *   "gameMode": "BASE"
     * }
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() request: CreateGameConfigRequest): GameConfigResponse {
        const { createdConfig } = this.createGameConfig.execute({
            gameMode: request.gameMode,
        });

        return GameConfigMapper.toGameConfigResponse(createdConfig);
    }

    /**
     * Retrieves a game configuration by its unique identifier.
     *
     * @param {string} id - The game config ID provided in the URL path.
     * @returns {GameConfigResponse} The game configuration.
     *
     * @example
     * GET /gameconfigs/:id
     */
    @Get(':id')
    getById(@Param('id') id: string): GameConfigResponse {
        const gameConfigId = new GameConfigId(id);
        const { config: foundConfig } = this.getGameConfig.execute(gameConfigId);

        return GameConfigMapper.toGameConfigResponse(foundConfig);
    }
}
