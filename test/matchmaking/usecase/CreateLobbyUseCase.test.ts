import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';

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

let useCase: CreateLobbyUseCase;

describe('CreateLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new CreateLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockLobbyFactory as LobbyFactory,
            mockPlayerFactory as PlayerFactory,
            mockOutboxService as OutboxService,
            mockJwtTokenService as JwtTokenService
        );
    });

    describe('execute', () => {
        it('creates and saves the new lobby, and returns a token', () => {
            const result = useCase.execute(new CreateLobbyDto(PLAYER_NAME));

            expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
            expect(mockLobbyFactory.create).toHaveBeenCalledWith(
                createdPlayer,
                createdLobby.gameConfigId
            );
            expect(mockLobbyRepository.save).toHaveBeenCalledWith(createdLobby);
            expect(mockJwtTokenService.encode).toHaveBeenCalledWith(
                createdPlayer.id,
                createdLobby.id
            );
            expect(result.createdLobby.id).toBe(lobby.id);
            expect(result.createdHostPlayer.id).toBe(players[0].id);
            expect(result.token).toBe(TOKEN);
        });
    });
});
