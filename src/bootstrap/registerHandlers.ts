import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { InMemoryEventBus } from '#matchmaking/infastructure/event-bus/InMemoryEventBus';
import { DeleteLobbyWhenClosedHandler } from '#matchmaking/usecase/handlers/DeleteLobbyWhenClosedHandler';

export function registerHandlers(bus: InMemoryEventBus, lobbyRepository: LobbyRepository): void {
    bus.register(LobbyClosed, new DeleteLobbyWhenClosedHandler(lobbyRepository));
}
