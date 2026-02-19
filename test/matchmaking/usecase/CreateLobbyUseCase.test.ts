import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';

const PLAYER_NAME = 'hostName';
const GAME_MODE = LobbyGameMode.BASE;
const { lobby, players } = LobbyMother.baseLobby();

const createdLobby = lobby;
const createdPlayer = players[0];
const createdLobbyConfig = { gameMode: GAME_MODE };
const mockLobbyConfigFactory: Partial<LobbyConfigFactory> = {
    createFromGameMode: vi.fn().mockReturnValue(createdLobbyConfig),
};
const mockPlayerFactory: Partial<PlayerFactory> = {
    create: vi.fn().mockReturnValue(createdPlayer),
};
const mockLobbyFactory: Partial<LobbyFactory> = { create: vi.fn().mockReturnValue(createdLobby) };
const mockLobbyRepository: Partial<LobbyRepository> = { save: vi.fn() };
const mockOutboxService: Partial<OutboxService> = { publishEvents: vi.fn() };

let useCase: CreateLobbyUseCase;

describe('CreateLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new CreateLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockLobbyFactory as LobbyFactory,
            mockPlayerFactory as PlayerFactory,
            mockLobbyConfigFactory as LobbyConfigFactory,
            mockOutboxService as OutboxService
        );
    });

    describe('execute', () => {
        it('create and save the new lobby', () => {
            const result = useCase.execute(new CreateLobbyDto(PLAYER_NAME, GAME_MODE));

            expect(mockLobbyConfigFactory.createFromGameMode).toHaveBeenCalledWith(GAME_MODE);
            expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
            expect(mockLobbyFactory.create).toHaveBeenCalledWith(createdLobbyConfig, createdPlayer);
            expect(mockLobbyRepository.save).toHaveBeenCalledWith(createdLobby);
            expect(result.createdLobby.id).toBe(lobby.id);
            expect(result.createdHostPlayer.id).toBe(players[0].id);
        });
    });
});
