/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { LobbyModule } from '#matchmaking/interface/http/lobby/lobby.module';
import { beforeEach, describe, it, expect } from 'vitest';

describe('LobbyController e2e', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [LobbyModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('POST /lobby', () => {
        it('creates a lobby and returns lobby and host player', async () => {
            const response = await request(app.getHttpServer())
                .post('/lobby')
                .send({ hostName: 'Alice', gameMode: 'BASE' })
                .expect(201);

            expect(response.body).toMatchObject({
                lobby: {
                    id: expect.any(String),
                    status: expect.any(String),
                    players: expect.arrayContaining([
                        expect.objectContaining({ name: 'Alice', isHost: true }),
                    ]),
                    config: { gameMode: 'BASE' },
                },
                selfPlayer: {
                    id: expect.any(String),
                    name: 'Alice',
                    isHost: true,
                    token: expect.any(String),
                },
            });
        });
    });

    describe('POST /lobby/:id/join', () => {
        it('joins an existing lobby and returns updated lobby and joining player', async () => {
            const createResponse = await request(app.getHttpServer())
                .post('/lobby')
                .send({ hostName: 'Alice', gameMode: 'BASE' })
                .expect(201);

            const lobbyId = createResponse.body.lobby.id as string;

            const joinResponse = await request(app.getHttpServer())
                .post(`/lobby/${lobbyId}/join`)
                .send({ playerName: 'Bob' })
                .expect(201);

            expect(joinResponse.body.lobby).toMatchObject({
                id: lobbyId,
                players: expect.arrayContaining([
                    expect.objectContaining({ name: 'Alice', isHost: true }),
                    expect.objectContaining({ name: 'Bob', isHost: false }),
                ]),
            });
            expect(joinResponse.body.selfPlayer).toMatchObject({
                name: 'Bob',
                isHost: false,
                token: expect.any(String),
            });
        });
    });

    describe('POST /lobby/:id/leave', () => {
        it('removes player from the lobby and returns 204', async () => {
            const createResponse = await request(app.getHttpServer())
                .post('/lobby')
                .send({ hostName: 'Alice', gameMode: 'BASE' })
                .expect(201);

            const lobbyId = createResponse.body.lobby.id as string;
            const token = createResponse.body.selfPlayer.token as string;

            const joinResponse = await request(app.getHttpServer())
                .post(`/lobby/${lobbyId}/join`)
                .send({ playerName: 'Bob' })
                .expect(201);

            const bobToken = joinResponse.body.selfPlayer.token as string;

            await request(app.getHttpServer())
                .post(`/lobby/${lobbyId}/leave`)
                .set('Authorization', `Bearer ${bobToken}`)
                .expect(204);

            const lobbyResponse = await request(app.getHttpServer())
                .get(`/lobby/${lobbyId}`)
                .expect(200);

            expect(lobbyResponse.body.players).toHaveLength(1);
            expect(lobbyResponse.body.players[0]).toMatchObject({ name: 'Alice' });

            void token;
        });
    });

    describe('GET /lobby/:id', () => {
        it('returns the lobby by its id', async () => {
            const createResponse = await request(app.getHttpServer())
                .post('/lobby')
                .send({ hostName: 'Alice', gameMode: 'BASE' })
                .expect(201);

            const lobbyId = createResponse.body.lobby.id as string;

            const response = await request(app.getHttpServer())
                .get(`/lobby/${lobbyId}`)
                .expect(200);

            expect(response.body).toMatchObject({
                id: lobbyId,
                players: expect.arrayContaining([
                    expect.objectContaining({ name: 'Alice', isHost: true }),
                ]),
                config: expect.objectContaining({ gameMode: 'BASE' }),
            });
        });
    });
});
