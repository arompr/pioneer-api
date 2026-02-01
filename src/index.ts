/* eslint-disable no-console */
import { createServer } from 'node:http';
import { createApp } from './app.ts';

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

/** Graceful shutdown (SIGTERM, SIGINT) */
function shutdown(signal: string) {
    console.log(`\nReceived ${signal}. Shutting down...`);
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
