/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';

describe('LobbyGateway (e2e)', () => {
    let app: INestApplication<App>;
    let port: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());

        await app.listen(0);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        port = (app.getHttpServer() as any).address().port;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('unknown command', () => {
        it('should emit an exception event for unregistered command', async () => {
            const client = await createClient(port);

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

            client.close();
        });
    });

    describe('Sync player flow', () => {
        let client: Socket;
        let token: string;

        beforeAll(async () => {
            client = await createClient(port);

            const createLobbyResponse = await request(app.getHttpServer())
                .post('/lobby')
                .send({ hostName: 'Alice', gameMode: 'BASE' })
                .expect(201);

            token = createLobbyResponse.body.selfPlayer.token;
        });

        afterAll(() => {
            client.close();
        });

        describe.sequential('when player is synced to their lobby', () => {
            it('should sync the player and return the updated lobby', async () => {
                client.emit('command', {
                    type: 'SYNC_PLAYER',
                    payload: { token },
                });

                const lobbyAfterSync = await waitForEvent(client, 'lobby.updated');

                expect(lobbyAfterSync).toMatchObject({
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

            it('should mark the player as ready and return the updated lobby', async () => {
                client.emit('command', {
                    type: 'MARK_READY',
                });

                const lobbyAfterReady = await waitForEvent(client, 'lobby.updated');

                expect(lobbyAfterReady).toMatchObject({
                    players: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'Alice',
                            status: PlayerStatus.Ready,
                        }),
                    ]),
                });
            });

            it('should mark the player as pending and return the updated lobby', async () => {
                client.emit('command', {
                    type: 'MARK_PENDING',
                });

                const lobbyAfterPending = await waitForEvent(client, 'lobby.updated');

                expect(lobbyAfterPending).toMatchObject({
                    players: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'Alice',
                            status: PlayerStatus.Pending,
                        }),
                    ]),
                });
            });
        });
    });

    describe('Not synced player flow', () => {
        it('should throw a not authenticated exception for commands requiring auth', async () => {
            const client = await createClient(port);

            client.emit('command', {
                type: 'MARK_READY',
            });

            const response = await waitForEvent(client, 'exception');

            expect(response).toMatchObject({
                code: 'SOCKET_NOT_AUTHENTICATED',
                message: expect.any(String),
                timestamp: expect.any(String),
            });

            client.close();
        });
    });
});

async function createClient(port: number): Promise<Socket> {
    const socket = io(`http://localhost:${port}/lobby`);

    await waitForEvent(socket, 'connect');

    return socket;
}

function waitForEvent<T = unknown>(socket: Socket, event: string): Promise<T> {
    return new Promise((resolve) => {
        const handler = (data: T) => {
            socket.off(event, handler);
            resolve(data);
        };

        socket.on(event, handler);
    });
}
