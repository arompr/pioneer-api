import { LobbyAggregate } from './LobbyAggregate.type';
import { LobbyId } from './lobbyId/LobbyId';

export interface LobbyRepository {
    findById(id: LobbyId): LobbyAggregate | null;
    save(lobby: LobbyAggregate): void;
    delete(id: LobbyId): void;
}
