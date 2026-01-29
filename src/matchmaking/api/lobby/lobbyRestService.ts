import { Router, type Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { CreateLobbyResponse } from './response/createLobbyResponse.ts';
import type { JoinLobbyRequest } from './request/joinLobbyRequest.ts';
import { body, validationResult } from 'express-validator';
import { PlayerFactory } from '../../domain/player/PlayerFactory.ts';
import { PlayerIdFactory } from '../../domain/player/playerId/PlayerIdFactory.ts';
import { CreatePlayer } from '../../usecase/CreatePlayerUseCase.ts';
import type { Player } from '../../domain/player/Player.ts';
import type { CreateLobbyRequest } from './request/createLobbyRequest.ts';

export const lobbyRestService = Router();

const playerIdFactory = new PlayerIdFactory();
const playerFactory = new PlayerFactory(playerIdFactory);
const createPlayerUseCase = new CreatePlayer(playerFactory);

/**
 * POST /lobby
 * Créer un lobby
 */
lobbyRestService.post(
    '/',
    body('playerName')
        .exists({ checkFalsy: true })
        .withMessage('playerName is required')
        .isString()
        .withMessage('playerName must be a string'),
    async (req: Request<{}, {}, CreateLobbyRequest>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: errors.array().map((e) => ({
                    message: e.msg,
                })),
            });
        }

        const { playerName } = req.body;
        const player: Player = createPlayerUseCase.execute(playerName);

        res.status(StatusCodes.CREATED).json(player);
    },
);

/**
 * POST /lobby/:code/join
 * Rejoindre une partie
 */
lobbyRestService.post(
    '/:code/join',
    body('playerName')
        .exists({ checkFalsy: true })
        .withMessage('playerName is required')
        .isString()
        .withMessage('playerName must be a string'),
    async (req: Request<{ code: string }, {}, JoinLobbyRequest>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: errors.array().map((e) => ({
                    field: e.param,
                    message: e.msg,
                })),
            });
        }

        const { code } = req.params;
        const { playerName } = req.body;

        res.json({
            code,
            playerName,
        });
    },
);
