import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';

export interface LobbyNotifier {
    notifyLobbyUpdated(lobby: LobbyAggregate): void;
}
