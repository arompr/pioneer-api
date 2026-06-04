import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';

const PLAYER_NAME = 'hostName';
const { lobby, players } = LobbyMother.baseLobby();
const TOKEN = 'mock-jwt-token';

const createdLobby = lobby;
const createdPlayer = players[0];
const mockPlayerFactory: Partial<PlayerFactory> = {
    create: vi.fn().mockReturnValue(createdPlayer),
};
const mockLobbyFactory: Partial<LobbyFactory> = { create: vi.fn().mockReturnValue(createdLobby) };
const mockLobbyRepository: Partial<LobbyRepository> = { save: vi.fn() };
const mockOutboxService: Partial<OutboxService> = { publishEvents: vi.fn() };
const mockJwtTokenService: Partial<JwtTokenService> = {
    encode: vi.fn().mockReturnValue(TOKEN),
};
const mockGameGateway: Partial<IGameGateway> = {
    createConfig: vi.fn().mockResolvedValue({ configId: 'default-config-id' }),
    validatePlayerCount: vi.fn().mockResolvedValue(true),
};

let useCase: CreateLobbyUseCase;

describe('CreateLobbyUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useCase = new CreateLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockLobbyFactory as LobbyFactory,
            mockPlayerFactory as PlayerFactory,
            mockOutboxService as OutboxService,
            mockJwtTokenService as JwtTokenService,
            mockGameGateway as IGameGateway
        );
    });

    describe('execute', () => {
        it('creates and saves the new lobby with default config, and returns a token', async () => {
            const result = await useCase.execute(new CreateLobbyDto(PLAYER_NAME));

            expect(mockGameGateway.createConfig).toHaveBeenCalledWith('BASE');
            expect(mockGameGateway.validatePlayerCount).toHaveBeenCalledWith(
                'default-config-id',
                1
            );
            expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
            expect(mockLobbyFactory.create).toHaveBeenCalledWith(createdPlayer, expect.any(Object));
            expect(mockLobbyRepository.save).toHaveBeenCalledWith(createdLobby);
            expect(mockJwtTokenService.encode).toHaveBeenCalledWith(
                createdPlayer.id,
                createdLobby.id
            );
            expect(result.createdLobby.id).toBe(lobby.id);
            expect(result.createdHostPlayer.id).toBe(players[0].id);
            expect(result.token).toBe(TOKEN);
        });

        it('uses provided gameConfigId when given', async () => {
            const result = await useCase.execute(
                new CreateLobbyDto(PLAYER_NAME, 'provided-config-id')
            );

            expect(mockGameGateway.createConfig).not.toHaveBeenCalled();
            expect(mockGameGateway.validatePlayerCount).toHaveBeenCalledWith(
                'provided-config-id',
                1
            );
            expect(result.createdLobby.id).toBe(lobby.id);
        });
    });
});
