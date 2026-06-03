import { InMemoryLobbyMapper } from '#matchmaking/infrastructure/db/inMemory/lobby/InMemoryLobbyMapper';
import { describe, expect, it } from 'vitest';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

describe('InMemoryLobbyMapper', () => {
    describe('toInMemory', () => {
        it.each([
            ['a base lobby', () => LobbyMother.baseLobby()],
            ['a base lobby with gameConfigId', () => LobbyMother.baseLobbyWithGameConfigId()],
            ['a full in-game lobby', () => LobbyMother.inGameLobby()],
            ['an empty closed lobby', () => LobbyMother.inClosedLobby()],
            ['a ready-to-start lobby', () => LobbyMother.readyToStartLobby()],
        ])('maps %s from Lobby to InMemoryLobby correctly', (_, motherFn) => {
            const { lobby } = motherFn();

            const imLobby = InMemoryLobbyMapper.toInMemory(lobby);

            expect(imLobby.id).toBe(lobby.id.value);
            expect(imLobby.hostId).toBe(lobby.hostId.value);
            expect(imLobby.state).toBe(lobby.stateType);
            expect(imLobby.players.length).toBe(lobby.playerCount);
            expect(imLobby.gameConfigId).toBe(lobby.gameConfigId?.value);
            lobby.allPlayers.forEach((original, index) => {
                const imPlayer = imLobby.players[index];
                expect(imPlayer.id).toBe(original.id.value);
                expect(imPlayer.name).toBe(original.name);
                expect(imPlayer.status).toBe(original.status);
            });
        });
    });

    describe('toDomain', () => {
        it.each([
            ['a base lobby', () => LobbyMother.baseLobby()],
            ['a base lobby with gameConfigId', () => LobbyMother.baseLobbyWithGameConfigId()],
            ['a full in-game lobby', () => LobbyMother.inGameLobby()],
            ['an empty closed lobby', () => LobbyMother.inClosedLobby()],
            ['a ready-to-start lobby', () => LobbyMother.readyToStartLobby()],
        ])('maps %s from InMemoryLobby to Lobby correctly', (_, motherFn) => {
            const { lobby } = motherFn();
            const imLobby = InMemoryLobbyMapper.toInMemory(lobby);

            const reconstructedLobby = InMemoryLobbyMapper.toDomain(imLobby);

            expect(reconstructedLobby.id.equals(lobby.id)).toBe(true);
            expect(reconstructedLobby.hostId.equals(lobby.hostId)).toBe(true);
            expect(reconstructedLobby.stateType).toBe(lobby.stateType);
            expect(reconstructedLobby.playerCount).toBe(lobby.playerCount);
            expect(reconstructedLobby.gameConfigId?.value).toBe(lobby.gameConfigId?.value);
            lobby.allPlayers.forEach((original, index) => {
                const mapped = reconstructedLobby.allPlayers[index];
                expect(mapped.id.equals(original.id)).toBe(true);
                expect(mapped.name).toBe(original.name);
                expect(mapped.status).toBe(original.status);
            });
        });
    });
});
