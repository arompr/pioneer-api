import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { EventBus } from '#common/usecase/EventBus';
import { PlayerLeftLobbyHandler } from '#matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyNotifier } from '#common/usecase/LobbyNotifier';

export function registerHandlers(
    bus: EventBus,
    lobbyNotifier: LobbyNotifier,
    getLobbyUseCase: GetLobbyUseCase
): void {
    bus.register(
        LobbyEventType.PlayerLeftLobby,
        new PlayerLeftLobbyHandler(lobbyNotifier, getLobbyUseCase)
    );
}
