import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateLobbyUseCase } from './CreateLobbyUseCase';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { CreateLobbyDto } from './dto/CreateLobbyDto';
import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';

const PLAYER_NAME = 'hostName';
const GAME_MODE = LobbyGameMode.BASE;
const LOBBY_ID = 'lobby-1';
const PLAYER_ID = 'player-1';

const createdLobby = { id: LOBBY_ID };
const createdPlayer = { id: PLAYER_ID };
const createdLobbyConfig = { gameMode: GAME_MODE };
const mockLobbyConfigFactory: Partial<LobbyConfigFactory> = {
    createFromGameMode: vi.fn().mockReturnValue(createdLobbyConfig),
};
const mockPlayerFactory: Partial<PlayerFactory> = {
    create: vi.fn().mockReturnValue(createdPlayer),
};
const mockLobbyFactory: Partial<LobbyFactory> = { create: vi.fn().mockReturnValue(createdLobby) };
const mockLobbyRepository: Partial<LobbyRepository> = { save: vi.fn() };

let useCase: CreateLobbyUseCase;

describe('CreateLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new CreateLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockLobbyFactory as LobbyFactory,
            mockPlayerFactory as PlayerFactory,
            mockLobbyConfigFactory as LobbyConfigFactory
        );
    });

    describe('execute()', () => {
        it('create and save the new lobby', () => {
            const result = useCase.execute(new CreateLobbyDto(PLAYER_NAME, GAME_MODE));

            expect(mockLobbyConfigFactory.createFromGameMode).toHaveBeenCalledWith(GAME_MODE);
            expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
            expect(mockLobbyFactory.create).toHaveBeenCalledWith(createdLobbyConfig, createdPlayer);
            expect(mockLobbyRepository.save).toHaveBeenCalledWith(createdLobby);
            expect(result.lobbyId).toBe(LOBBY_ID);
            expect(result.playerId).toBe(PLAYER_ID);
        });
    });
});
