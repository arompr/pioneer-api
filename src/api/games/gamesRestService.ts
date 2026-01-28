import { Router, type Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { GameResponse } from './response/gameResponse.ts';
import type { JoinGameRequest } from './request/joinGameRequest.ts';
import { body, validationResult } from 'express-validator';

export const gameRestService = Router();

/**
 * POST /games
 * Créer une partie
 */
gameRestService.post('/', async (_req, res) => {
    const game: GameResponse = {
        gameId: '123',
        code: 'ABCDE',
        status: 'WAITING_FOR_PLAYERS',
        players: [],
    };

    res.status(StatusCodes.CREATED).json(game);
});

/**
 * POST /games/:code/join
 * Rejoindre une partie
 */
gameRestService.post(
    '/:code/join',
    body('playerName')
        .exists({ checkFalsy: true })
        .withMessage('playerName is required')
        .isString()
        .withMessage('playerName must be a string'),
    async (req: Request<{ code: string }, {}, JoinGameRequest>, res) => {
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

/**
 * GET /games/:code
 * État d’une partie
 */
gameRestService.get('/:code', async (req, res) => {
    const { code } = req.params;

    res.json({
        code,
        status: 'WAITING_FOR_PLAYERS',
    });
});
