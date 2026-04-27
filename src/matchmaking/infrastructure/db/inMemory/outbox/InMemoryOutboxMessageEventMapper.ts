import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import {
    LobbyClosedUseCaseEvent,
    LobbyHostChangedUseCaseEvent,
    LobbyStartedUseCaseEvent,
    PlayerJoinedLobbyUseCaseEvent,
    PlayerLeftLobbyUseCaseEvent,
    PlayerMarkedPendingUseCaseEvent,
    PlayerMarkedReadyUseCaseEvent,
} from '#matchmaking/usecase/events';

const eventFactories: Readonly<Record<string, (message: OutboxMessage) => UseCaseEvent>> = {
    [LobbyEventType.PlayerJoinedLobby.value]: (message) =>
        new PlayerJoinedLobbyUseCaseEvent(
            new LobbyId(message.aggregateId),
            message.eventPayload.playerId as PlayerId
        ),
    [LobbyEventType.PlayerLeftLobby.value]: (message) =>
        new PlayerLeftLobbyUseCaseEvent(
            new LobbyId(message.aggregateId),
            message.eventPayload.playerId as PlayerId,
            message.eventPayload.wasHost as boolean
        ),
    [LobbyEventType.LobbyClosed.value]: (message) =>
        new LobbyClosedUseCaseEvent(new LobbyId(message.aggregateId)),
    [LobbyEventType.LobbyHostChanged.value]: (message) =>
        new LobbyHostChangedUseCaseEvent(
            new LobbyId(message.aggregateId),
            message.eventPayload.newHostId as PlayerId
        ),
    [LobbyEventType.LobbyStarted.value]: (message) =>
        new LobbyStartedUseCaseEvent(new LobbyId(message.aggregateId)),
    [LobbyEventType.PlayerMarkedPending.value]: (message) =>
        new PlayerMarkedPendingUseCaseEvent(
            new LobbyId(message.aggregateId),
            message.eventPayload.playerId as PlayerId
        ),
    [LobbyEventType.PlayerMarkedReady.value]: (message) =>
        new PlayerMarkedReadyUseCaseEvent(
            new LobbyId(message.aggregateId),
            message.eventPayload.playerId as PlayerId
        ),
};

/**
 * Mapper for reconstructing typed use case events from OutboxMessage instances.
 */
export class InMemoryOutboxMessageEventMapper {
    /**
     * Converts an OutboxMessage into the corresponding typed use case event instance.
     * Falls back to a plain `{ type, payload }` object for unrecognised event types.
     *
     * @param {OutboxMessage} message - The outbox message to convert.
     * @returns {UseCaseEvent} The reconstructed use case event, or a plain event object if the type is not registered.
     */
    static toUseCaseEvent(message: OutboxMessage): UseCaseEvent {
        const eventFactory = eventFactories[message.eventType];

        if (eventFactory) {
            return eventFactory(message);
        }

        return { type: message.eventType, payload: message.eventPayload };
    }
}
