import express, { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function createApp() {
    const app = express();

    app.use(express.json());

    app.get('/health', (_req: Request, res: Response) => {
        res.status(StatusCodes.OK).json({ status: 'ok' });
    });

    return app;
}
