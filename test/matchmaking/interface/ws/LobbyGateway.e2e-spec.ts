/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';

describe('LobbyGateway (e2e)', () => {
    let app: INestApplication<App>;
    let client: Socket;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());

        await app.listen(0);
        const port = app.getHttpServer().address().port;

        client = io(`http://localhost:${port}/lobby`);

        await waitForEvent(client, 'connect');
    });

    afterAll(async () => {
        client.close();
        await app.close();
    });

    beforeEach(async () => {
        const createLobbyResponse = await request(app.getHttpServer())
            .post('/lobby')
            .send({ hostName: 'Alice', gameMode: 'BASE' })
            .expect(201);

        token = createLobbyResponse.body.selfPlayer.token;
    });

    describe('unknown command', () => {
        it('should emit an exception event for unregistered command ', async () => {
            client.emit('command', {
                type: 'UNKNOWN_COMMAND',
                payload: {},
            });

            const response = await waitForEvent(client, 'exception');

            expect(response).toMatchObject({
                code: 'UNKNOWN_COMMAND',
                message: expect.any(String),
                timestamp: expect.any(String),
            });
        });
    });

    describe('SYNC_PLAYER command', () => {
        it('should sync the player and return the updated lobby', async () => {
            client.emit('command', {
                type: 'SYNC_PLAYER',
                payload: { token },
            });

            const response = await waitForEvent(client, 'lobby.updated');

            expect(response).toBeDefined();
            expect(response).toMatchObject({
                id: expect.any(String),
                status: expect.any(String),
                players: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Alice',
                        status: PlayerStatus.Pending,
                        isHost: true,
                    }),
                ]),
                config: { gameMode: 'BASE' },
            });
        });
    });
});

function waitForEvent<T = unknown>(socket: Socket, event: string): Promise<T> {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}
