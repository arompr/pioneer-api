import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { InMemoryLobby } from './InMemoryLobby';
import { InMemoryLobbyMapper } from './InMemoryLobbyMapper';

export class InMemoryLobbyRepository implements LobbyRepository {
    private lobbies = new Map<string, InMemoryLobby>();

    async findById(id: LobbyId): Promise<LobbyAggregate | null> {
        const lobby = this.lobbies.get(id.toString());
        if (!lobby) return Promise.resolve(null);
        return Promise.resolve(InMemoryLobbyMapper.toDomain(lobby));
    }

    async save(lobby: LobbyAggregate): Promise<void> {
        this.lobbies.set(lobby.id.toString(), InMemoryLobbyMapper.toInMemory(lobby));
        await Promise.resolve();
    }

    async delete(id: LobbyId): Promise<void> {
        this.lobbies.delete(id.toString());
        await Promise.resolve();
    }
}
