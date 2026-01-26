import express, { type Request, type Response } from 'express';

export function createApp() {
    const app = express();

    app.use(express.json());

    app.get('/health', (_req: Request, res: Response) => {
        res.json({ status: 'ok' });
    });

    app.get('/', (_req, res) => {
        res.send('Hello');
    });

    return app;
}
