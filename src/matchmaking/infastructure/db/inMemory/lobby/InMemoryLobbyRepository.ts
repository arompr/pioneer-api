import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { InMemoryLobby } from './InMemoryLobby';
import { InMemoryLobbyMapper } from './InMemoryLobbyMapper';

export class InMemoryLobbyRepository implements LobbyRepository {
    private lobbies = new Map<string, InMemoryLobby>();

    findById(id: LobbyId): LobbyAggregate | null {
        const lobby = this.lobbies.get(id.toString());
        if (!lobby) return null;
        return InMemoryLobbyMapper.toDomain(lobby);
    }

    save(lobby: LobbyAggregate): void {
        this.lobbies.set(lobby.id.toString(), InMemoryLobbyMapper.toInMemory(lobby));
    }

    delete(id: LobbyId): void {
        this.lobbies.delete(id.toString());
    }
}
