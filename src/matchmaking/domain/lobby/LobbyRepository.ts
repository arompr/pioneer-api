import { LobbyAggregate } from './LobbyAggregate.type';
import { LobbyId } from './lobbyId/LobbyId';

export interface LobbyRepository {
    findById(id: LobbyId): Promise<LobbyAggregate | null>;
    save(lobby: LobbyAggregate): Promise<void>;
    delete(id: LobbyId): Promise<void>;
}
